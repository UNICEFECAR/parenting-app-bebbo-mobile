import { getRealmLib, safeOpenRealm } from './realmSafe';

// Bound UTF-8 storage size too: one UTF-16 code unit takes at most three
// UTF-8 bytes. Four million units stay below Realm's 16 MB string boundary.
const FRAGMENT_SIZE = 4000000;

const ITEM_SCHEMA = {
  name: "ReduxPersistItem",
  primaryKey: "name",
  properties: {
    name: "string",
    fragments: "string[]"
  }
};

let ItemSchemaClass = null;
async function getItemSchemaClass() {
  if (!ItemSchemaClass) {
    const Realm = await getRealmLib();
    class ItemSchema extends Realm.Object {
      static schema = ITEM_SCHEMA;

      get content() {
        return this.fragments.join("");
      }
    }
    ItemSchemaClass = ItemSchema;
  }
  return ItemSchemaClass;
}

export function fragmentString(str) {
  if (typeof str !== 'string') throw new TypeError('Persisted value must be a string');
  const fragments = [];
  let start = 0;
  while (start < str.length) {
    let end = Math.min(start + FRAGMENT_SIZE, str.length);
    // Never turn a split surrogate pair into two invalid native UTF-8 strings.
    if (end < str.length) {
      const before = str.charCodeAt(end - 1), after = str.charCodeAt(end);
      if (before >= 0xD800 && before <= 0xDBFF && after >= 0xDC00 && after <= 0xDFFF) end--;
    }
    fragments.push(str.slice(start, end));
    start = end;
  }
  return fragments;
}

// Wrap function to support both Promise and callback
// Copied from repo https://github.com/Nohac/redux-persist-expo-fs-storage/blob/master/index.js
async function withCallback(callback, func) {
  try {
    const result = await func();
    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

function createRealmAccess(path) {
  let __realm = null;
  return async function accessRealm() {
    if (!__realm) {
      // const Realm = await getRealmLib();
      const ItemSchema = await getItemSchemaClass();
      try {
        __realm = await safeOpenRealm({
          schema: [ItemSchema],
          schemaVersion: 1,
          path,
          onMigration: (oldRealm, newRealm) => {
            if (oldRealm.schemaVersion < 1) {
              const oldItems = oldRealm.objects(ITEM_SCHEMA.name);
              const newItems = newRealm.objects(ITEM_SCHEMA.name);
              for (let i = 0; i < oldItems.length; i++) {
                newItems[i].fragments = fragmentString(oldItems[i].content);
              }
            }
          },
        });
      } catch (error) {
        console.log("realmPersistor accessRealm error", error);
        throw error;
      }
    }
    return __realm;
  };
}

export function createRealmPersistStorage({ path } = {}) {
  const accessRealm = createRealmAccess(path);

  async function accessItemInstances() {
    const realm = await accessRealm();
    const ItemSchema = await getItemSchemaClass();
    return realm.objects(ItemSchema);
  }

  async function getItem(key, callback) {
    return withCallback(callback, async function() {
      const items = await accessItemInstances();
      const matches = items.filtered("name = $0", key);
      if (matches.length > 0 && matches[0]) {
        return matches[0].content;
      } else {
        throw new Error(`Could not get item with key: '${key}'`);
      }
    });
  }

  async function setItem(key, value, callback) {
    return withCallback(callback, async function() {
      const Realm = await getRealmLib();
      const realm = await accessRealm();
      realm.write(() => {
        realm.create(
          ITEM_SCHEMA.name,
          {
            name: key,
            fragments: fragmentString(value),
          },
          Realm.UpdateMode.Modified
        );
      });
    });
  }

  async function removeItem(key, callback) {
    return withCallback(callback, async function() {
      const realm = await accessRealm();
      const items = await accessItemInstances();
      realm.write(() => {
        const item = items.filtered("name = $0", key);
        realm.delete(item);
      });
    });
  }

  return {
    getItem,
    setItem,
    removeItem
  };
}