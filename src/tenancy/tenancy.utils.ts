import { DatabaseService } from '../database/database.service';
import { UserService } from '../modules/user/user.service';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from 'src/entities/public/user.entity';

export async function getTenantConnection(
  wallet: string,
  dbService: DatabaseService,
  userService: UserService
): Promise<DataSource> {
  let connectionName: string;
  let user = await userService.get(wallet);

  if (!user) {
    return null;
  }

  connectionName = getConnectionName(user);

  const databaseSource = new DataSource({
    ...(dbService.tenantTypeOrmOptions() as PostgresConnectionOptions),
    name: connectionName,
    schema: connectionName,
  });

  return databaseSource.isInitialized
    ? Promise.resolve(databaseSource)
    : databaseSource.initialize();
}

export function getConnectionName(user: User): string {
  //replace '-' with '_' to avoid errors
  const id = user.id.toString().replace(/-/g, `_`);
  return `space_${id}`;
}