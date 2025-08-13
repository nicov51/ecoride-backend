import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';
import { User } from './user.entity';

@Entity()
export class ReviewModeration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review)
  review: Review;

  @ManyToOne(() => User)
  moderator: User;

  @Column()
  decision: 'approved' | 'rejected';

  @Column()
  reason: string;
}
