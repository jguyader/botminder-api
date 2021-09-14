import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post }                                                                                from './post.entity';
import { User }                                                                                from './user.entity';

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(type => User)
    @JoinColumn()
    user: User;

    @ManyToOne(type => Post, { nullable: false })
    @JoinColumn()
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}
