"""Exercise Bebbo Dev's public staging CMS on an ephemeral English Android CI device."""
import os
from pathlib import Path
import re
import subprocess
import time
import xml.etree.ElementTree as ET

REPORT = Path(os.environ['RUNNER_TEMP']) / 'native-smoke'
PACKAGE = 'org.unicef.bebbodev'


def adb(*args):
    return subprocess.check_output(['adb', *args], timeout=45)


def snapshot():
    adb('shell', 'uiautomator', 'dump', '/sdcard/dev-journey.xml')
    xml = adb('exec-out', 'cat', '/sdcard/dev-journey.xml')
    return ET.fromstring(xml), xml


def persist(label, xml):
    (REPORT / (label + '.xml')).write_bytes(xml)
    (REPORT / (label + '.png')).write_bytes(adb('exec-out', 'screencap', '-p'))
    print(label, flush=True)


def find(tree, pattern, attribute=''):
    for node in tree.iter('node'):
        if attribute and node.get('class') == attribute:
            return node
        if pattern and any(re.search(pattern, node.get(key, '').strip(), re.I)
                           for key in ('text', 'content-desc')):
            return node
    return None


def touch(node, left=False):
    x1, y1, x2, y2 = map(int, re.findall(r'\d+', node.get('bounds')))
    adb('shell', 'input', 'tap', str(x1 + (x2-x1)//(12 if left else 2)), str((y1+y2)//2))
    time.sleep(1)


def locate(pattern, label, *, tap=False, left=False, scroll=False, attribute='', timeout=90):
    until = time.monotonic() + timeout
    while time.monotonic() < until:
        tree, xml = snapshot()
        node = find(tree, pattern, attribute)
        if node is not None and node.get('enabled') != 'false':
            persist(label, xml)
            if tap:
                touch(node, left)
            return
        # Dismiss only the known data-saver and country fallback messages.
        for prompt, button in [('Poor connection', '^Cancel$'), ('^Attention$', '^OK$')]:
            if find(tree, prompt) is not None:
                action = find(tree, button)
                if action is not None:
                    touch(action)
                    break
        else:
            if find(tree, 'not all content') is not None:
                persist(label + '-download-error', xml)
                raise RuntimeError('Staging content download failed during ' + label)
            if scroll:
                adb('shell', 'input', 'swipe', '440', '1150', '440', '460', '460')
            time.sleep(2)
    _, xml = snapshot()
    persist(label + '-unreached', xml)
    raise RuntimeError('Could not verify ' + label)


def main():
    if os.environ.get('CI') != 'true' or os.environ.get('ANDROID_APP_ID') != PACKAGE:
        raise SystemExit('Bebbo Dev journey requires the disposable CI flavour')
    # Consistent English labels and viewport for the real forms and system keyboard.
    adb('shell', 'wm', 'size', '900x1600')
    adb('shell', 'wm', 'density', '300')
    locate(r'^Welcome!$', 'dev-welcome')
    locate(r'^Continue$', 'dev-confirm-country', tap=True, scroll=True)
    locate('I have read, understood', 'dev-terms', tap=True, left=True, scroll=True)
    locate(r'^Continue$', 'dev-accept-terms', tap=True, scroll=True)
    locate('What is your name|basic info about yourself', 'dev-caregiver')
    locate('', 'dev-caregiver-input', tap=True, attribute='android.widget.EditText')
    adb('shell', 'input', 'text', 'TestCaregiver')
    adb('shell', 'input', 'keyevent', '4')
    locate('^You are', 'dev-caregiver-role', tap=True, scroll=True)
    locate(r'\bMother\b', 'dev-caregiver-mother', tap=True)
    locate(r'^Continue$', 'dev-caregiver-continue', tap=True, scroll=True)
    locate(r'^Skip$', 'dev-child-profile-skip', tap=True, scroll=True)
    locate(r'^Home(?:,|$)', 'dev-home', timeout=180)
    for index, (menu, header) in enumerate([
        ('Vaccinations', '^Upcoming$|^Previous$|^Vaccination summary$'),
        ('Health check-ups', '^Health check-up$|^Add doctor visit$'),
        ("Child.s growth", '^No growth measurements recorded$|^Add new measurement$'),
    ], 1):
        locate(r'^Tools(?:,|$)', f'dev-tools-menu-{index}', tap=True)
        locate('^'+menu+'$', f'dev-tool-choice-{index}', tap=True)
        tree, _ = snapshot()
        intro = find(tree, r'^Continue$')
        if intro is not None:
            touch(intro)
        locate(header, f'dev-tool-open-{index}', scroll=True)
    adb('shell', 'svc', 'wifi', 'disable')
    adb('shell', 'svc', 'data', 'disable')
    try:
        adb('shell', 'am', 'force-stop', PACKAGE)
        adb('shell', 'monkey', '-p', PACKAGE, '-c', 'android.intent.category.LAUNCHER', '1')
        locate(r'^Home(?:,|$)', 'dev-offline-cold-start', timeout=100)
    finally:
        adb('shell', 'svc', 'wifi', 'enable')
        adb('shell', 'svc', 'data', 'enable')


if __name__ == '__main__':
    main()
