jest.mock('../../../App',()=>({store:{getState:jest.fn()}}));
jest.mock('@dr.pogodin/react-native-fs',()=>({exists:jest.fn().mockResolvedValue(false)}));
jest.mock('react-native-permissions',()=>({requestNotifications:jest.fn()}));
jest.mock('uuid',()=>({v4:()=> 'converted-measure'}));
jest.mock('../../instances',()=>({appConfig:{}}));
jest.mock('../../database/dbquery/dataRealmCommon',()=>({dataRealmCommon:{}}));
jest.mock('../../redux/sagaMiddleware/sagaSlice',()=>({receiveAPIFailure:jest.fn()}));
jest.mock('../childCRUD',()=>({isFutureDate:jest.fn(()=>false)}));
jest.mock('../LocalNotifications',()=>({__esModule:true,default:{}}));
jest.mock('@types/types',()=>({CHILDREN_PATH:'/children/'}));
import {getChild} from '../Utils';
import {isFutureDate} from '../childCRUD';
const child={uuid:'one',childName:'Synthetic',gender:40,birthDate:'2024-01-01T00:00:00Z',reminders:[],favoriteadvices:[],favoritegames:[]};
test.each([
  ['', '', '', ''],
  [null, null, '', ''],
  ['85', '', '85.00', ''],
  ['', '12000', '', '12.00'],
])('legacy vaccination/partial measurement remains restorable (%s / %s)',async(length,weight,height,expectedWeight)=>{
  const restored=await getChild({...child,measures:JSON.stringify([{uuid:'old',length,weight,didChildGetVaccines:true,vaccineIds:[5],measurementPlace:'doctor',doctorComment:'Synthetic record'}])},[]);
  const measure=restored.measures[0];
  expect(measure.height).toBe(height);expect(measure.weight).toBe(expectedWeight);expect(measure.isChildMeasured).toBe(false);
  expect(measure.vaccineIds).toBe('[{"uuid":5}]');expect(measure.doctorComment).toBe('Synthetic record');expect(measure.measurementPlace).toBe(0);
  expect(measure).not.toHaveProperty('length');
});
test('current array-format measurements retain their stored units and fields',async()=>{
  const measures=[{uuid:'current',weight:'12',height:'85',isChildMeasured:true,didChildGetVaccines:false,measurementPlace:0}];
  const restored=await getChild({...child,measures},[]);expect(restored.measures).toEqual(measures);
});

test('a past-due pregnancy retains its explicitly stored expected-child flag',async()=>{
  const restored=await getChild({...child,measures:[],isExpected:'true'},[]);expect(restored.isExpected).toBe('true');
});
test('an explicit born-child flag is not overwritten by a date-based guess',async()=>{
  jest.mocked(isFutureDate).mockReturnValueOnce(true);
  const restored=await getChild({...child,measures:[],isExpected:'false'},[]);expect(restored.isExpected).toBe('false');
});
test('legacy boolean profile flags are normalised without losing their meaning',async()=>{
  const restored=await getChild({...child,measures:[],isExpected:true,isPremature:true,autoChild:true},[]);
  expect(restored).toMatchObject({isExpected:'true',isPremature:'true',autoChild:'true'});
});
