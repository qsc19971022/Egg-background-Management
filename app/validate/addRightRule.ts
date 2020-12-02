export default {
    rightName: {
        type: 'string',
        trim: true,
        allowNull: false
    },
    rightDesc: {
        type: 'string',
        trim: true,
        allowNull: false
    },
    rightType:{
        type: 'string',
        trim: true,
        allowNull: false
    },
    rightPath:{
        required:false,
        allowNull: true,
        type: 'string',
        trim: true
    }
}
