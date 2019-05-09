// 采用重复编码的方式保障传入的动作描述与定义的一致
export const actionTypes = {
    CLEAR_LOGIN_DATA: 'clear_login_data',
    SAVE_LOGIN_DATA: 'save_login_data',
}

export const actionCreator = {
    clearLoginData: () => ({
        type: actionTypes.CLEAR_LOGIN_DATA,
    }),

    saveLoginData: (data) => ({
        type: actionTypes.SAVE_LOGIN_DATA,
        data,
    }),
}