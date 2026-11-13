import pathlib, plistlib, subprocess, os, tempfile, unittest, re, collections, xml.etree.ElementTree as ET
ROOT = pathlib.Path(__file__).resolve().parents[2]
FLAGS = ['FirebaseAutomaticScreenReportingEnabled','GOOGLE_ANALYTICS_IDFV_COLLECTION_ENABLED',
'GOOGLE_ANALYTICS_REGISTRATION_WITH_AD_NETWORK_ENABLED','GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_STORAGE',
'GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_USER_DATA','GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_PERSONALIZATION_SIGNALS','FacebookAdvertiserIDCollectionEnabled']
class IOSConfiguration(unittest.TestCase):
    def test_resource_phases_do_not_copy_two_files_to_the_same_bundle_name(self):
        project=(ROOT/'ios/ParentBuddyApp.xcodeproj/project.pbxproj').read_text()
        section=project.split('/* Begin PBXResourcesBuildPhase section */')[1].split('/* End PBXResourcesBuildPhase section */')[0]
        phases=re.findall(r'([A-F0-9]{24}) /\* Resources \*/ = \{(.*?)\n\t\t\};',section,re.S)
        self.assertGreaterEqual(len(phases),10)
        for identifier,body in phases:
            names=re.findall(r'/\* (.*?) in Resources \*/',body)
            # Asset catalogs and storyboards are compiled instead of copied.
            copied=[name for name in names if not name.endswith(('.xcassets','.storyboard'))]
            duplicates=[name for name,count in collections.Counter(copied).items() if count>1]
            self.assertEqual(duplicates,[],f'{identifier}: colliding copied resources')
    def test_every_app_plist_disables_duplicate_auto_screens_and_advertising_collection(self):
        files=list((ROOT/'ios').glob('*-Info.plist'))+[ROOT/'ios/ParentBuddyApp/Info.plist']
        self.assertEqual(len(files),10)
        for file in files:
            value=plistlib.loads(file.read_bytes())
            for key in FLAGS:self.assertIs(value.get(key),False,str(file)+':'+key)
    def test_every_app_scheme_uploads_archive_symbols_with_its_own_environment(self):
        files=[p for p in (ROOT/'ios/ParentBuddyApp.xcodeproj/xcshareddata/xcschemes').glob('*.xcscheme') if 'tvOS' not in p.name]
        self.assertEqual(len(files),10)
        for file in files:
            doc=ET.parse(file).getroot()
            actions=doc.findall('ArchiveAction/PostActions/ExecutionAction/ActionContent')
            self.assertEqual(len(actions),1,file.name)
            action=actions[0]
            self.assertIn('ios-archive-symbols.sh',action.get('scriptText'))
            expected=doc.find('BuildAction/BuildActionEntries/BuildActionEntry/BuildableReference')
            actual=action.find('EnvironmentBuildable/BuildableReference')
            self.assertEqual(expected.get('BlueprintIdentifier'),actual.get('BlueprintIdentifier'))
            self.assertIn(expected.get('BuildableName'),action.get('scriptText'))
    def test_unsigned_archive_never_invokes_external_symbol_upload(self):
        result=subprocess.run(['bash',str(ROOT/'scripts/ios-archive-symbols.sh'),'App.app'],env={**os.environ,'CODE_SIGNING_ALLOWED':'NO'},capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertIn('Skipping',result.stdout)
    def test_xcode_flavour_defaults_and_mismatches(self):
        mapping={'ParentBuddyApp':'bebbo','ParentBuddyAppDev':'bebboDev','ParentBuddyAppXk':'foleja',
         'ParentBuddyAppXkDev':'foleja','ParentBuddyAppBangla':'babuni','ParentBuddyAppBanglaDev':'babuni',
         'MerhabaBebek':'merhabaBebek','Wawamor':'wawamor','ReraiUmntwana':'reraiUmntwana','BebboPacific':'bebboPacific'}
        for target,flavour in mapping.items():
            env={**os.environ,'TARGET_NAME':target,'SRCROOT':str(ROOT/'ios'),'FLAVOR':'','CONFIGURATION':'Debug'}
            result=subprocess.run(['bash','-c','source ios/.xcode.env; echo "$FLAVOR"'],cwd=ROOT,env=env,capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertEqual(result.stdout.strip(),flavour)
            env['FLAVOR']='wrong'
            result=subprocess.run(['bash','-c','source ios/.xcode.env'],cwd=ROOT,env=env,capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)

class IOSArchive(unittest.TestCase):
    def setUp(self):
        import importlib.util
        spec=importlib.util.spec_from_file_location('archivecheck',ROOT/'scripts/check-ios-archive.py')
        self.check=importlib.util.module_from_spec(spec);spec.loader.exec_module(self.check)
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.folder=pathlib.Path(self.temp.name)
        self.app=self.folder/'Products/Applications/App.app';self.app.mkdir(parents=True)
        self.info={'CFBundleIdentifier':'org.test.app','CFBundleExecutable':'App','MinimumOSVersion':'15.1',**{k:False for k in self.check.FLAGS}}
        self.google={'BUNDLE_ID':'org.test.app','PROJECT_ID':'test-project','GOOGLE_APP_ID':'1:test:ios:fixture'}
        self.write()
        symbols=self.folder/'dSYMs/App.app.dSYM/Contents/Resources/DWARF';symbols.mkdir(parents=True);(symbols/'App').write_bytes(b'synthetic')
    def write(self):
        (self.app/'Info.plist').write_bytes(plistlib.dumps(self.info))
        (self.app/'GoogleService-Info.plist').write_bytes(plistlib.dumps(self.google))
    def inspect(self):return self.check.inspect(self.folder,'org.test.app','test-project')['problems']
    def test_valid_archive(self):self.assertEqual(self.inspect(),[])
    def test_rejects_wrong_firebase_configuration(self):
        self.google['BUNDLE_ID']='org.wrong';self.google['PROJECT_ID']='wrong-project';self.write()
        self.assertEqual(len(self.inspect()),2)
    def test_requires_built_privacy_flags_and_original_minimum(self):
        self.info['FirebaseAutomaticScreenReportingEnabled']=True;self.info['MinimumOSVersion']='16.0';self.write()
        self.assertEqual(len(self.inspect()),2)
    def test_requires_app_dsym(self):
        import shutil
        shutil.rmtree(self.folder/'dSYMs');self.assertIn('App executable dSYM is missing',self.inspect())
