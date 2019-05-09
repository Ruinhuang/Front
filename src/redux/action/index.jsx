export const actionTypes = {
    CHANGE_INPUT_VALUE: 'change_input_value',
    ADD_TODO_ITEM: 'add_todo_item',
    DELETE_TODO_ITEM: 'delete_todo_item',
    INIT_LIST: 'init_list',
    GET_INIT_LIST: 'get_init_list',
}

export const actionCreator = {
    // 引入redux-thunk后, 可以返回一个函数, dispatch检测到传入的对象如果是函数,会执行函数
    getInputAction: (value) => {
        return (dispatch) => {
            const action = {
                type: actionTypes.CHANGE_INPUT_VALUE,
                value,
            }
            dispatch(action)
        }
    },

    clickButtonAction: () => ({
        type: actionTypes.ADD_TODO_ITEM,
    }),

    deleteItemAction: (index) => ({
        type: actionTypes.DELETE_TODO_ITEM,
        index,
    }),

    initListAction: (data) => ({
        type: actionTypes.INIT_LIST,
        data,
    }),

    getInitList: () => ({
        type: actionTypes.GET_INIT_LIST,
    }),
}