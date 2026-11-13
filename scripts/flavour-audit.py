"""Static source/configuration matrix; never prints credentials or assumes delivery."""
import re, json, plistlib, pathlib, xml.etree.ElementTree as ET
root = pathlib.Path(__file__).resolve().parent.parent
flavours = {
'bebbo': ('prod','ParentBuddyApp','Production','org.unicef.ecar.bebbo','ecaro-bebbo'),
'bebboDev': ('prodstaging','ParentBuddyAppDev','Development','org.unicef.bebbodev',None),
'babuni': ('bangla','ParentBuddyAppBangla','Bangla','org.unicef.bangladesh.babuni','babuni-app'),
'foleja': ('xk','ParentBuddyAppXk','Xk','org.unicef.kosovo.foleja','kosovo-foleja'),
'merhabaBebek': ('merhababebek','MerhabaBebek','MerhabaBebek','org.unicef.ecar.merhababebek','merhaba-bebek-b7fd0'),
'wawamor': ('wawamor','Wawamor','Wawamor','org.unicef.ec.wawamor','wawamor-19d69'),
'reraiUmntwana': ('reraiumntwana','ReraiUmntwana','ReraiUmntwana','org.unicef.zw.reraiumntwana','rerai-umntwana'),
'bebboPacific': ('bebbopacific','BebboPacific','BebboPacific','org.unicef.pc.bebbopacific','bebbo-pacific')}
project = (root/'ios/ParentBuddyApp.xcodeproj/project.pbxproj').read_text()
gradle = (root/'android/app/build.gradle').read_text()
android_ns = '{http://schemas.android.com/apk/res/android}'
def objects(section):
    text = project.split('/* Begin '+section+' section */')[1].split('/* End '+section+' section */')[0]
    return {m[0]: (m[1],m[2]) for m in re.findall(r'^\t\t([A-F0-9]{24}) /\* (.*?) \*/ = \{(.*?)^\t\t\};',text,re.M|re.S)}
targets, configs, lists = objects('PBXNativeTarget'), objects('XCBuildConfiguration'), objects('XCConfigurationList')
resources, phases = objects('PBXResourcesBuildPhase'), objects('PBXShellScriptBuildPhase')
def field(body,key):
    match = re.search(r'\b'+re.escape(key)+r' = (.*?);',body)
    return match[1].strip('"') if match else None
rows = []
for flavour,(variant,target,group,bundle,project_id) in flavours.items():
    configpath = root/f'app/instances/{flavour}/config/appConfig.ts'
    assert configpath.exists(), flavour
    native = re.search(r'\b'+variant+r' \{\s*applicationId [\'\"]([^\'\"]+)',gradle)
    assert native and native[1] == bundle, f'{flavour}: Android application ID mismatch'
    scheme=root/f'ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes/{target}.xcscheme'
    assert scheme.exists(), f'{flavour}: missing iOS scheme'
    target_ids = [key for key,(name,_) in targets.items() if name == target]
    assert len(target_ids)==1, f'{flavour}: missing/duplicate iOS app target'
    body=targets[target_ids[0]][1]
    config_list = lists[field(body,'buildConfigurationList').split()[0]][1]
    ios_configs=[]
    for config_id in re.findall(r'([A-F0-9]{24}) /\* (?:Debug|Release) \*/',config_list):
        name,conf=configs[config_id]
        assert field(conf,'PRODUCT_BUNDLE_IDENTIFIER')==bundle, f'{flavour}/{name}: iOS bundle ID mismatch'
        info=field(conf,'INFOPLIST_FILE'); assert info and (root/'ios'/info).exists()
        plist=plistlib.loads((root/'ios'/info).read_bytes())
        ios_configs.append({'configuration':name,'bundle_id':bundle,'info_plist':info,
          'minimum_os':field(conf,'IPHONEOS_DEPLOYMENT_TARGET'),
          'ats_arbitrary_loads':plist.get('NSAppTransportSecurity',{}).get('NSAllowsArbitraryLoads',False),
          'firebase_screen_reporting_disabled':plist.get('FirebaseAutomaticScreenReportingEnabled') is False,
          'meta_advertising_id_default_disabled':plist.get('FacebookAdvertiserIDCollectionEnabled') is False,
          'privacy_usage_keys':sorted(k for k in plist if k.startswith('NS') and k.endswith('UsageDescription'))})
    lang=(root/f'app/instances/{flavour}/assets/locale/availableLanguage.ts').read_text()
    lang='\n'.join(line for line in lang.splitlines() if not line.lstrip().startswith('//'))
    lang=lang.split('const AVAILABLE_LANGUAGES')[1].split('};')[0]
    languages=re.findall(r'^\s*(\w+)\s*[,\n]',lang,re.M)
    source_dir = flavour if flavour in ['reraiUmntwana','bebboPacific'] else variant
    manifest = root/f'android/app/src/{source_dir}/AndroidManifest.xml'
    assert manifest.exists(), f'{flavour}: missing branded manifest'
    source=ET.parse(manifest).getroot()
    permissions=sorted(n.get(android_ns+'name') for n in source.findall('uses-permission'))
    phase_names = [name for key,(name,_) in phases.items() if key in body]
    row={'flavour':flavour,'android_variant':variant,'application_id':bundle,'ios_target':target,
      'firebase_project_candidate_from_console':project_id,'firebase_configuration_verified':False,
      'firebase_association_status':'unverified without real release GoogleServices files; project existence is not flavour routing proof',
      'env_file':f'env/.env.{flavour}','endpoint_status':'production environment unavailable; local files are unsigned CI fixtures',
      'language_resources_registered':languages,'android_manifest':str(manifest.relative_to(root)),
      'android_manifest_permissions':permissions,'ios_configurations':ios_configs,
      'ios_checked_in_script_phases':phase_names,
      'google_service_plist_group':group,'assets_status':'96 generated native resources verified separately',
      'feature_status':'shared tools/backup/FAQ; country-specific configuration retained; live endpoints not verified'}
    rows.append(row)
aux=[]
for key,(name,body) in targets.items():
    if name in ['ParentBuddyAppXkDev','ParentBuddyAppBanglaDev']:
        config_list=lists[field(body,'buildConfigurationList').split()[0]][1]
        aux.append({'ios_target':name,'configurations':[{'name':configs[c][0],
          'bundle_id':field(configs[c][1],'PRODUCT_BUNDLE_IDENTIFIER'),'info_plist':field(configs[c][1],'INFOPLIST_FILE')}
          for c in re.findall(r'([A-F0-9]{24}) /\* (?:Debug|Release) \*/',config_list)],'native_build_status':'not included in primary eight-flavour build matrix'})
report={'evidence':'static source inspection; identifiers validated against explicit project mappings',
 'limitations':'Firebase projects observed read-only where available; installed release routing is not confirmed. Languages are registered UI resource keys, not translation-quality approval.',
 'flavours':rows,'additional_country_development_targets':aux,
 'additional_android_variants':{'xkstaging':'com.datamatics.foleja','banglastaging':'com.datamatics.bangla'}}
file=root/'docs/upgrades/react-native-0.87/flavour-matrix.json'
text=json.dumps(report,ensure_ascii=False,indent=2)+'\n'
import sys
if '--check' in sys.argv:
    assert file.read_text()==text, 'Flavour matrix is stale; regenerate'
else:file.write_text(text)
print(f'{len(rows)} primary flavours: native IDs, schemes, source manifests, plist paths checked; {len(aux)} additional iOS development targets inventoried')
