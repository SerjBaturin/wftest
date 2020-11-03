const noop = () => {};

const hasAction = store => {
    store.dispatch.ifHasAction = (action, payload) => {
        const hasAction = Reflect.has(store._actions, action);

        if (hasAction) {
            store.dispatch.call(store, action, payload);
        }

        return {
            else: hasAction ? noop : cb => cb(),
        };
    };
};

export default hasAction;