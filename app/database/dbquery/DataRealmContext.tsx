import React from 'react';
import Realm from 'realm';
import { dataRealmCommon } from './dataRealmCommon';
export interface DataRealmContextValue {
    realm: Realm | null;
}

interface DataRealmProviderState {
    realm: Realm | null;
}

export const DataRealmContext = React.createContext<DataRealmContextValue>( {} as DataRealmContextValue );

export class DataRealmProvider extends React.PureComponent<object, DataRealmProviderState> {
    public state: Readonly<DataRealmProviderState> = {
        realm: null
    };

    constructor(props: object) {
        super(props);
        this.onRealmChange = this.onRealmChange.bind(this);
        this.openRealm();
    }

    private async openRealm() {
        const realm = await dataRealmCommon.openRealm();

        if (realm) {
            this.setState({realm});
            realm.addListener('change', this.onRealmChange);
        } else {
            console.warn('DataRealmProvider was not able to open realm');
        }
    }

    private onRealmChange() {
        this.forceUpdate();
    }

    public componentWillUnmount() {
        if (this.state.realm) {
            this.state.realm.removeListener('change', this.onRealmChange);
            
            if (!this.state.realm.isClosed) {
                this.state.realm.close();
            }
        }
    }

    public render() {
        const contextValue: DataRealmContextValue = {
            realm: this.state.realm,
        };

        return (
            <DataRealmContext.Provider value={contextValue}>{this.props.children}</DataRealmContext.Provider>
        );
    }
}

export const DataRealmConsumer = DataRealmContext.Consumer;