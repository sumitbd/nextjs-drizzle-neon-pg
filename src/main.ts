// import 'dotenv';
import {asc, sql} from 'drizzle-orm';
import {db} from './drizzle/db';
import {UserPreferencesTable, UserTable} from './drizzle/schema';

async function main() {

    // await db.insert(UserTable).values({
    //   name: 'Sumit2',
    //   age: 30,
    //   email: "sumit@sarkar2.com"
    // }).returning  ({
    //   id: UserTable.id,
    //   userName: UserTable.name,
    // });


    // const user = await db.query.UserTable.findMany();
    // console.log(user);

    // await db.delete(UserTable);

    // const usersAfterDelete = await db.query.UserTable.findMany();
    // console.log(usersAfterDelete);

    // const user = await db
    //   .insert(UserTable)
    //   .values([
    //     {
    //       name: 'Sumit',
    //       age: 39,
    //       email: 'sumit@demo.com',
    //     },
    //     {
    //       name: 'Sarkar',
    //       age: 35,
    //       email: 'sarkar@demo.com',
    //     },
    //   ])
    //   .returning({
    //     id: UserTable.id,
    //     userName: UserTable.name,
    //   })
    //   .onConflictDoUpdate({
    //     target: UserTable.email,
    //     set: { name: 'Updated Name' },
    //   });

    // console.log({ user });

    await db.insert(UserPreferencesTable).values({
        emailUpdates: true,
        userId: '3f8961fc-714b-4dd5-a04d-a0fefaba651a',
    });

    const users = await db.query.UserTable.findMany({
        columns: {name: true, age: true},
        extras: {
            lowerCaseName: sql<string>`lower(
            ${UserTable.name}
            )`.as('lowerCaseName')
        },
        with: {
            preferences: {columns: {emailUpdates: true}},
            posts: {
                with: {postCategories: true},
            },
        },
        orderBy: asc(UserTable.age),
        where: (table, funcs) => funcs.gt(table.age, 35),
    });

    console.log(users);

// const users = await db.query.UserTable.findMany({
//   columns: { name: true, age: true },
//   extras: { lowerCaseName: sql<string>`lower(${UserTable.name})`.as('lowerCaseName') },
// });

// console.log(users);

}

main();
