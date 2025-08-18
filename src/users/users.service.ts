import { Inject, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FullUserRecord, User, UserFromFirebase } from './user.schema';
import { UsersRepository } from './users.repository';
import { FIREBASE_APP_INJECTION_TOKEN } from 'src/firebase/firebase.module';

/**
 * Set the maximum users firebase allow to retrieve at the same time.
 * @see https://firebase.google.com/docs/auth/admin/manage-users#list_all_users
 */
const MAX_FIREBASE_USERS_GET = 1000;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(FIREBASE_APP_INJECTION_TOKEN)
    private readonly firebaseAdmin: admin.app.App,
  ) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.save({ ...dto });
  }

  async findAll(): Promise<FullUserRecord[]> {
    const usersFromAuth = await this.getAllUsersFromFirebaseAuth();
    const users: FullUserRecord[] = [];

    for (const userFromAuth of usersFromAuth) {
      const simpleFirebaseUser: UserFromFirebase = {
        uid: userFromAuth.uid,
        email: userFromAuth.email,
      };

      let userFromDb;
      try {
        userFromDb = await this.usersRepository.findOne({
          uid: userFromAuth.uid,
        });
      } catch {
        userFromDb = await this.syncFirebaseUser(userFromAuth);
      }
      users.push({ ...simpleFirebaseUser, ...userFromDb } as FullUserRecord);
    }

    return users;
  }

  async findOne(id: string) {
    const userFromDb = await this.usersRepository.findById(id);
    const userFromAuth = await this.firebaseAdmin.auth().getUser(userFromDb.uid);

    const simpleFirebaseUser: UserFromFirebase = {
      uid: userFromAuth.uid,
      email: userFromAuth.email,
    };

    return { ...simpleFirebaseUser, ...userFromDb };
  }

  async findOneByUid(uid: string): Promise<FullUserRecord> {
    const userFromAuth = await this.firebaseAdmin.auth().getUser(uid);
    const simpleFirebaseUser: UserFromFirebase = {
      uid: userFromAuth.uid,
      email: userFromAuth.email,
    };

    let userFromDb: User;
    try {
      userFromDb = await this.usersRepository.findOne({
        uid: userFromAuth.uid,
      });
    } catch {
      userFromDb = await this.syncFirebaseUser(userFromAuth);
    }
    return { ...simpleFirebaseUser, ...userFromDb } as FullUserRecord;
  }

  update(id: string, dto: UpdateUserDto) {
    return this.usersRepository.updateById(id, { ...dto });
  }

  private syncFirebaseUser(userRecord: admin.auth.UserRecord) {
    const dto = new CreateUserDto();
    dto.uid = userRecord.uid;
    dto.credentials = [];

    return this.create(dto);
  }

  private async getAllUsersFromFirebaseAuth(): Promise<admin.auth.UserRecord[]> {
    let users: admin.auth.UserRecord[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const results = await this.firebaseAdmin
        .auth()
        .listUsers(MAX_FIREBASE_USERS_GET, nextPageToken);
      users = users.concat(results.users);
      nextPageToken = results.pageToken;
    } while (nextPageToken);

    return users;
  }
}
