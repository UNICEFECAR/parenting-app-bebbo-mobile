"""Check the built app, not merely source plist/scheme settings. Never print keys."""
import argparse, json, pathlib, plistlib
FLAGS=['FirebaseAutomaticScreenReportingEnabled','GOOGLE_ANALYTICS_IDFV_COLLECTION_ENABLED',
'GOOGLE_ANALYTICS_REGISTRATION_WITH_AD_NETWORK_ENABLED','GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_STORAGE',
'GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_USER_DATA','GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_PERSONALIZATION_SIGNALS',
'FacebookAdvertiserIDCollectionEnabled']
def inspect(archive,expected_id,expected_project):
    apps=list((pathlib.Path(archive)/'Products/Applications').glob('*.app'))
    if len(apps)!=1:raise ValueError('Expected exactly one archived application')
    app=apps[0]
    info=plistlib.loads((app/'Info.plist').read_bytes())
    google=plistlib.loads((app/'GoogleService-Info.plist').read_bytes())
    problems=[]
    if info.get('CFBundleIdentifier')!=expected_id:problems.append('Archived application identifier mismatch')
    if google.get('BUNDLE_ID')!=expected_id:problems.append('Archived Firebase bundle identifier mismatch')
    if google.get('PROJECT_ID')!=expected_project:problems.append('Archived Firebase project mismatch')
    if ':ios:' not in google.get('GOOGLE_APP_ID',''):problems.append('Archived Firebase app ID is not iOS')
    if info.get('MinimumOSVersion')!='15.1':problems.append('Supported iOS minimum changed from 15.1')
    for key in FLAGS:
        if info.get(key) is not False:problems.append('Missing/incorrect built setting: '+key)
    executable=info.get('CFBundleExecutable','')
    symbols=list((pathlib.Path(archive)/'dSYMs').glob(f'*.app.dSYM/Contents/Resources/DWARF/{executable}'))
    if not symbols:problems.append('App executable dSYM is missing')
    return {'archive_app':app.name,'application_id':info.get('CFBundleIdentifier'),
      'firebase_project':google.get('PROJECT_ID'),'minimum_ios':info.get('MinimumOSVersion'),
      'privacy_flags_checked':FLAGS,'app_dsym_present':bool(symbols),'problems':problems}
if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('archive');parser.add_argument('--application-id',required=True)
    parser.add_argument('--firebase-project',required=True);parser.add_argument('--report',required=True)
    args=parser.parse_args();report=inspect(args.archive,args.application_id,args.firebase_project)
    pathlib.Path(args.report).write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2));raise SystemExit(bool(report['problems']))
