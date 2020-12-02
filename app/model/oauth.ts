/**
 * @desc 用户表
 */
import { Column, DataType, Model, Table, CreatedAt, UpdatedAt,ForeignKey,BelongsTo} from 'sequelize-typescript';
import {User} from './user';
@Table({
    modelName: 'oauth'
})
export class Oauth extends Model<Oauth> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        comment: '用户ID',
    })
    id: number;

    @Column({
        field:'access_token',
        type:DataType.STRING(255),
        allowNull:false,
        comment: '授权令牌',
    })
    accessToken: string;

    @Column({
        type:DataType.STRING(255),
        allowNull:false,
        comment: '授权来源',
    })
    provider: string;

    @Column({
        type:DataType.INTEGER,
        allowNull:false,
        unique:true,
        comment: '三方平台用户id',
    })
    uid: number;
    @ForeignKey(() => User)
    @Column({
        field:'user_id',
        type: DataType.INTEGER,
        allowNull:false,
        unique:true,
    })
    userId: number;
    @BelongsTo(() => User)
    user: User;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
};
export default () => Oauth;
