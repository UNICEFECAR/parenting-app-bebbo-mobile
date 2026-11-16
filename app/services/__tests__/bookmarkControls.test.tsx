import React from 'react';
import {act,create,ReactTestRenderer} from 'react-test-renderer';
import {Alert} from 'react-native';
import ShareFavButtons,{ShareFavPress} from '../../components/shared/ShareFavButtons';
import {toggleBookmark} from '../bookmarks';
import {logEvent} from '../EventSyncService';
const mockDispatch=jest.fn();
let mockState:any;
jest.mock('../../../App',()=>({useAppDispatch:()=>mockDispatch,useAppSelector:(selector:any)=>selector(mockState),store:{getState:()=>mockState}}));
jest.mock('../../instances',()=>({appConfig:{shareTextButton:'https://example.test/'}}));
jest.mock('@styles/typography',()=>({Heading4:require('react-native').Text}));
jest.mock('react-i18next',()=>({useTranslation:()=>({t:(key:string)=>key})}));
jest.mock('../../customHooks/useNetInfoHook',()=>()=>({isConnected:false}));
jest.mock('../selectors',()=>({selectActiveChildUuid:(state:any)=>state.childData.childDataSet.activeChild.uuid}));
jest.mock('../../redux/reducers/childSlice',()=>({setFavouriteAdvices:(payload:any)=>({type:'advices',payload}),setFavouriteGames:(payload:any)=>({type:'games',payload})}));
jest.mock('../bookmarks',()=>({toggleBookmark:jest.fn()}));
jest.mock('../EventSyncService',()=>({logEvent:jest.fn().mockResolvedValue(undefined)}));
jest.mock('../../components/shared/Icon',()=>({__esModule:true,default:require('react-native').View,OuterIconRow:require('react-native').View,OuterIconLeft1:require('react-native').View}));
let view:ReactTestRenderer;
beforeEach(async()=>{
  jest.clearAllMocks();mockState={selectedCountry:{languageCode:'en'},childData:{childDataSet:{activeChild:{uuid:'one'}}}};
  await act(async()=>{view=create(<ShareFavButtons item={{id:12,title:'Advice'}} isAdvice isFavourite={false}/>);});
});
afterEach(async()=>{await act(async()=>view.unmount());});
test('a confirmed removal produces one removal event and its stored list',async()=>{
  jest.mocked(toggleBookmark).mockResolvedValue({ids:[],added:false});
  await act(async()=>{await view.root.findAllByType(ShareFavPress)[1].props.onPress();});
  expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({payload:[]}));
  expect(logEvent).toHaveBeenCalledWith({name:'favourite_advise_removed',params:{advise_id:12}},false);
});
test('repeated taps do not start overlapping native writes',async()=>{
  let resolve!:(value:any)=>void;
  jest.mocked(toggleBookmark).mockImplementation(()=>new Promise(done=>{resolve=done;}));
  const press=view.root.findAllByType(ShareFavPress)[1].props.onPress;
  await act(async()=>{const first=press();await press();resolve({ids:[12],added:true});await first;});
  expect(toggleBookmark).toHaveBeenCalledTimes(1);expect(logEvent).toHaveBeenCalledTimes(1);
});
test('a profile change before React rerenders cannot overwrite the new child favourites',async()=>{
  let resolve!:(value:any)=>void;
  jest.mocked(toggleBookmark).mockImplementation(()=>new Promise(done=>{resolve=done;}));
  await act(async()=>{
    const saving=view.root.findAllByType(ShareFavPress)[1].props.onPress();
    mockState={...mockState,childData:{childDataSet:{activeChild:{uuid:'two'}}}};
    resolve({ids:[12],added:true});await saving;
  });
  expect(mockDispatch).not.toHaveBeenCalled();
  expect(logEvent).toHaveBeenCalledTimes(1);
});
test('a failed save is recoverable and never emits a success event',async()=>{
  const alert=jest.spyOn(Alert,'alert').mockImplementation(()=>{});
  jest.mocked(toggleBookmark).mockRejectedValue(new Error('No profile'));
  await act(async()=>{await view.root.findAllByType(ShareFavPress)[1].props.onPress();});
  expect(mockDispatch).not.toHaveBeenCalled();expect(logEvent).not.toHaveBeenCalled();expect(alert).toHaveBeenCalled();alert.mockRestore();
});
