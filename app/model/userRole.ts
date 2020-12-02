/**
 * @desc 角色表
 */
import {Column, DataType, Model, Table, CreatedAt, UpdatedAt,ForeignKey} from 'sequelize-typescript';
import {User} from "./user";
import {Role} from "./roles";

@Table
export class userRole extends Model<userRole> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        comment: 'ID',
    })
    id: number;
    @ForeignKey(() => User)
    @Column({
        type:DataType.INTEGER,
        field:'user_id',
        allowNull:false,
        unique:true,
        comment: '用户id'
    })
    userId: number;
    @ForeignKey(() => Role)
    @Column({
        type:DataType.INTEGER,
        field:'role_id',
        allowNull:false,
        unique:true,
        comment: '角色id'
    })
    roleId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
};
export default () => userRole;
