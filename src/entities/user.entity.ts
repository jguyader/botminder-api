import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Like } from './like.entity';
import { Post } from './post.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    username: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(type => Like, like => like.post)
    likes: Like[];

    @CreateDateColumn()
    createdAt: Date;
}
