"""Record concrete UI checkpoints on a disposable, installed Bebbo Dev package."""
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import time

spec = importlib.util.spec_from_file_location('journey', Path(__file__).with_name('android-dev-journey.py'))
ui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ui)
results = []


def opened(label, expected, *, tap=False, scroll=False):
    for attempt in range(8):
        tree, xml = ui.snapshot()
        node = ui.find(tree, expected)
        if node is not None:
            ui.persist(label, xml)
            results.append({'checkpoint': label, 'result': 'Passed', 'observed': node.get('text') or node.get('content-desc')})
            if tap:
                ui.touch(node)
            return node
        if scroll and attempt >= 1:
            ui.adb('shell', 'input', 'swipe', '450', '1190', '450', '480', '400')
        time.sleep(.4)
    ui.persist(label + '-unreached', xml)
    raise ValueError(label)


def click(label, pattern, scroll=False):
    return opened(label, pattern, tap=True, scroll=scroll)


def back():
    ui.adb('shell', 'input', 'keyevent', '4')
    time.sleep(.7)


def home():
    # Restarting the existing process retains profiles and downloaded data.
    ui.adb('shell', 'am', 'force-stop', ui.PACKAGE)
    ui.adb('shell', 'monkey', '-p', ui.PACKAGE, '-c', 'android.intent.category.LAUNCHER', '1')
    for _ in range(18):
        tree, _ = ui.snapshot()
        if ui.find(tree, 'Daily reads|Today.s advice|child profile is incomplete') is not None:
            return
        time.sleep(1)
    raise ValueError('home-after-restart')


def drawer():
    tree, _ = ui.snapshot()
    # The home hamburger's labelled glyph is defined by the existing Fontello map.
    node = ui.find(tree, '^\ue824$')
    if node is None:
        raise ValueError('home-drawer-control')
    ui.touch(node)


def tool(name):
    click('open-tools-'+name, '^Tools$')
    click('choose-'+name, {'vaccines':'^Vaccinations$', 'health':'^Health check-ups$', 'growth':'^Child.s growth$'}[name])
    tree, _ = ui.snapshot()
    intro = ui.find(tree, '^Continue$')
    if intro is not None:
        ui.touch(intro)


def content():
    tree, _ = ui.snapshot()
    card = ui.find(tree, r'^Today.s advice,\s*.+')
    if card is None:
        raise ValueError('article-card')
    title = re.split(r',\s*', card.get('content-desc'), maxsplit=1)[1]
    click('home-save-article', '^Save$')
    ui.touch(card)
    opened('article-detail', '^'+re.escape(title)+'$')
    back()
    opened('article-return-home', 'Daily reads')
    drawer()
    click('drawer-favourites', '^Favourites$', True)
    opened('saved-article-listed', re.escape(title))


def tab(name,pattern):
    click('tab-'+name, '^'+name+'$')
    opened('loaded-'+name, pattern)


def growth():
    tool('growth')
    click('new-measure', '^Add new measurement$', True)
    opened('measurement-form', 'Date of measurement|Where was the child measured')
    click('weight-entry', '^Weight$', True)
    tree,_ = ui.snapshot()
    intro=ui.find(tree,'^Continue$')
    if intro is not None:ui.touch(intro)
    opened('weight-ruler','^Add weight$')
    ui.adb('shell','input','swipe','690','820','285','820','450')
    click('weight-return','^Save$',True)
    click('height-entry','^Height$',True)
    tree,_=ui.snapshot()
    intro=ui.find(tree,'^Continue$')
    if intro is not None:ui.touch(intro)
    opened('height-ruler','^Add height$')
    ui.adb('shell','input','swipe','690','820','285','820','450')
    click('height-return','^Save$',True)
    tree,_=ui.snapshot()
    place=ui.find(tree,'^At home$')
    if place is not None:ui.touch(place)
    click('save-combined-measure','^Save$',True)
    opened('measurement-history','Last measured|All measurements|Weight for height',scroll=True)


def vaccination():
    tool('vaccines')
    click('vaccination-previous','^Previous$')
    click('vaccination-upcoming','^Upcoming$')
    click('vaccine-record-entry','^Enter vaccines received$',True)
    opened('vaccine-form','Date of vaccination|Vaccines received|Select vaccines|Vaccines taken')
    back()
    click('vaccine-reminder','^Set vaccination reminder$',True)
    opened('vaccine-reminder-form','date and time of the vaccination|Date of vaccination|^Set reminder$')


def checkup():
    tool('health')
    click('new-check-up','^Add doctor visit$',True)
    opened('check-up-form','New health check-up|Date of health check-up')
    back()
    click('check-up-reminder','^Set health check-up reminder$',True)
    opened('check-up-reminder-form','date and time of the health check-up|^Set reminder$')


def menu(name,entry,proof):
    drawer()
    click('drawer-'+name,entry,True)
    opened('view-'+name,proof)


def local_backup():
    # The all-zero cipher configuration belongs exclusively to the unsigned CI fixture.
    now='2026-01-01T12:00:00.000Z'
    raw=json.dumps([{'uuid':'qa-portable-child','childName':'RestoreQA','gender':706,'birthDate':'2025-01-01T12:00:00.000Z','createdAt':now,'updatedAt':now,'autoChild':'false','measures':[],'reminders':[],'checkedMilestones':[],'favoriteadvices':[],'favoritegames':[]}]).encode()
    enc=subprocess.check_output(['openssl','enc','-aes-256-cbc','-K','0'*64,'-iv','0'*32,'-nosalt','-a','-A'],input=raw)
    p=Path(os.environ['RUNNER_TEMP'])/'BebboLegacyQA.json'
    p.write_bytes(enc)
    ui.adb('push',str(p),'/sdcard/Download/BebboLegacyQA.json')
    drawer()
    click('backup-settings','^Settings$',True)
    click('backup-import','^Upload saved data$',True)
    click('backup-select-local','^Device$|^File$|^Local file$|^Local storage$|^Device storage$|^Files$|^Your device$|^File manager$|^File explorer$',True)
    tree,_=ui.snapshot()
    if ui.find(tree,'BebboLegacyQA') is None:
        menu_node=ui.find(tree,'Show roots|^Open navigation drawer$')
        if menu_node is not None:
            ui.touch(menu_node)
            click('backup-downloads-folder','^Downloads$')
    click('backup-select-fixture','BebboLegacyQA')
    click('backup-confirm-replacement','^Continue$|^Restore$')
    home()
    opened('legacy-child-after-restart','RestoreQA',scroll=True)


def main():
    if os.environ.get('CI')!='true' or os.environ.get('ANDROID_APP_ID')!=ui.PACKAGE:
        raise SystemExit('A disposable Bebbo Dev CI installation is required')
    scenarios=[
        ('article and favourite',content),
        ('games tab',lambda:tab('Games',r'Playing together|Choose games|Search|All games|Activity')),
        ('advice tab',lambda:tab('Advice',r'Choose advice|Search|All advice|Expert advice')),
        ('development tab',lambda:tab('Development',r"milestone|child.s development|developmental")),
        ('growth',growth),('vaccination',vaccination),('health check-ups',checkup),
        ('notifications',lambda:menu('notifications','^Notifications$','^Notifications$|There are no notifications')),
        ('settings',lambda:menu('settings','^Settings$','Data Saver Mode|Download latest content|Back up your data')),
        ('user guide',lambda:menu('guide','^User guide$','User guide|Next|Getting started')),
        ('about',lambda:menu('about','^About Bebbo$|^About us$','About Bebbo|About us|Partners')),
        ('FAQ',lambda:menu('FAQ','^Chat$|^Support$|^Questions and answers$','Chat|What would you like|Select a category')),
        ('privacy',lambda:menu('privacy','^Privacy Policy$','Privacy Policy')),
        ('terms',lambda:menu('terms','^Terms and Conditions$','Terms and Conditions')),
        ('legacy backup via Android picker',local_backup),
    ]
    for name,check in scenarios:
        try:
            home()
            check()
        except (ValueError,RuntimeError,subprocess.SubprocessError) as error:
            results.append({'scenario':name,'result':'Not Verified','stopped_at':str(error)[:180]})
        (ui.REPORT/'acceptance.json').write_text(json.dumps(results,indent=2))
    if not any(row['result']=='Passed' for row in results):
        raise SystemExit('No installed-app acceptance checkpoint could be verified')


if __name__=='__main__':
    main()
