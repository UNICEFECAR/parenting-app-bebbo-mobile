jest.mock('../../../App',()=>({store:{getState:jest.fn()}}));
jest.mock('@dr.pogodin/react-native-fs',()=>({exists:jest.fn().mockResolvedValue(false)}));
jest.mock('react-native-permissions',()=>({requestNotifications:jest.fn()}));
jest.mock('uuid',()=>({v4:()=> 'converted-measure'}));
jest.mock('../../instances',()=>({appConfig:{}}));
jest.mock('../../database/dbquery/dataRealmCommon',()=>({dataRealmCommon:{}}));
jest.mock('../../redux/sagaMiddleware/sagaSlice',()=>({receiveAPIFailure:jest.fn()}));
jest.mock('../childCRUD',()=>({isFutureDate:()=>false}));
jest.mock('../LocalNotifications',()=>({__esModule:true,default:{}}));
jest.mock('@types/types',()=>({CHILDREN_PATH:'/children/'}));
import {getChild} from '../Utils';
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
