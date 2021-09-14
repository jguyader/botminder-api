import {
    AfterLoad,
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(type => User)
    @JoinColumn()
    author: User;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(type => Like, like => like.post)
    likes: Like[];

    likesCount: number;

    @AfterLoad()
    getLikesNb() {
        this.likesCount = this.likes?.length || 0;
    }
}
