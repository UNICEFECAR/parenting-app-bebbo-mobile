jest.mock('../../database/dbquery/userRealmCommon',()=>({userRealmCommon:{getFilteredData:jest.fn(),delete:jest.fn()}}));
jest.mock('../LocalNotifications',()=>({__esModule:true,default:{cancelReminderLocalNotification:jest.fn()}}));
jest.mock('../firebaseAnalytics',()=>({logAnalyticsEvent:jest.fn().mockResolvedValue(undefined),recordError:jest.fn().mockResolvedValue(undefined)}));
import {deleteProfileRecord} from '../profileDeletion';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';
import LocalNotifications from '../LocalNotifications';
import {logAnalyticsEvent,recordError} from '../firebaseAnalytics';
const data=jest.mocked(userRealmCommon),cancel=jest.mocked(LocalNotifications.cancelReminderLocalNotification);
const reminder={reminderDateDefined:1893456000000,reminderTimeDefined:1893459600000};
beforeEach(()=>{jest.clearAllMocks();data.getFilteredData.mockResolvedValue([{reminders:[reminder]}]);data.delete.mockResolvedValue('success');cancel.mockResolvedValue(undefined);});
test('a missing profile is a recoverable failed deletion with no success event or reminder loss',async()=>{
  data.getFilteredData.mockResolvedValue([]);
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(false);
  expect(data.delete).not.toHaveBeenCalled();expect(cancel).not.toHaveBeenCalled();expect(logAnalyticsEvent).not.toHaveBeenCalled();
});
test('failed database deletion leaves reminders intact and records no success',async()=>{
  data.delete.mockResolvedValue('error');
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(false);
  expect(cancel).not.toHaveBeenCalled();expect(logAnalyticsEvent).not.toHaveBeenCalled();
});
test('reminders are detached before deletion and cancelled only after confirmed commit',async()=>{
  const rows=[{reminders:[{...reminder}]}];data.getFilteredData.mockResolvedValue(rows);
  data.delete.mockImplementation(async()=>{expect(cancel).not.toHaveBeenCalled();rows[0].reminders.length=0;return 'success';});
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(true);
  expect(cancel).toHaveBeenCalledTimes(1);expect(logAnalyticsEvent).toHaveBeenCalledWith('profile_deleted',{source:'manage_profile',profile_type:'caregiver_entered'});
});
test('malformed reminder dates are not passed into native cancellation',async()=>{
  data.getFilteredData.mockResolvedValue([{reminders:[{reminderDateDefined:'bad',reminderTimeDefined:'bad'}]}]);
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(true);expect(cancel).not.toHaveBeenCalled();
});
test('post-commit cancellation rejection is not misreported as an undone deletion',async()=>{
  cancel.mockRejectedValue(new Error('native request failed'));
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(true);expect(logAnalyticsEvent).toHaveBeenCalledTimes(1);expect(recordError).toHaveBeenCalledTimes(1);
});

test('overlapping deletion requests cannot produce duplicate successful deletions',async()=>{
  let release!:(value:any)=>void;data.delete.mockImplementation(()=>new Promise(resolve=>{release=resolve;}));
  const first=deleteProfileRecord('ChildEntity','one','uuid == "one"');
  while(!release) await Promise.resolve();
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(false);
  release('success');await expect(first).resolves.toBe(true);
  expect(data.delete).toHaveBeenCalledTimes(1);expect(logAnalyticsEvent).toHaveBeenCalledTimes(1);
});

test('placeholder removal is distinguished without uploading child identity',async()=>{
  data.getFilteredData.mockResolvedValue([{autoChild:'true',reminders:[],uuid:'one',childName:'Private'}]);
  await expect(deleteProfileRecord('ChildEntity','one','uuid == "one"')).resolves.toBe(true);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('profile_deleted',{source:'manage_profile',profile_type:'placeholder'});
});
