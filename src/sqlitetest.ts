// libs needed for project runtime:
// npm i sqlite3
// npm i dotenv
// libs needed for project developer time:
// npm i --save-dev @types/node

// to read .env contents
import dotenv from 'dotenv'
dotenv.config()
// sqlite3 is the current sqlite lib
import sqlite3, { Database } from 'sqlite3'

// let's create interfaces needed in sql queries
interface Hero {
    hero_id:number,
    hero_name:string,
    is_xman:string,
    was_snapped:string
}
interface Hero_power {
    hero_id:number,
    hero_power:string
}
// DB open or create
const dbfile:string = process.env.DBFILE ? process.env.DBFILE : "./db/default.db"
let db:Database = new Database(dbfile, (err:Error|null) => {
    if(err) {
        console.log(`Error in creating or opening db file: ${dbfile}`)
        throw err
    }
})

createTables()
insertRows()
runQueries()

function createTables() {
    db.exec(`
    drop table if exists hero;
    create table if not exists hero(
        hero_id int primary key not null,
        hero_name text not null,
        is_xman text not null,
        was_snapped text not null
    );
    drop table if exists hero_power;
    create table if not exists hero_power(
        hero_id int not null,
        hero_power text not null
    );
    `,(err:Error|null) => {
        if(err) {
            console.log(`Error ${err} in creating tables!`)
            throw err
        }
    })
}

function insertRows() {
    db.exec(`
    insert into hero (hero_id, hero_name, is_xman, was_snapped)
        values (1,'Keke','N', 'N'),
                (2,'Kalle','N', 'N'),
                (3,'Jussi','N', 'N'),
                (4,'Jaakko','N', 'N'),
                (5,'Kalle','N', 'N'),
                (6,'Anni','N', 'N');
    insert into hero_power (hero_id, hero_power)
        values (1,'Formulakuski'),
                (1,'Snookerammattilainen'),
                (2,'Lusmuilija'),
                (3,'Opiskelija'),
                (3,'Formulakuski'),
                (4,'Juoppo'),
                (5,'Kovatyyppi'),
                (6,'Skeittaaja');
    `,(err:Error|null) => {
        if(err) {
            console.log(`Error ${err} in inserting demo rows!`)
            throw err
        }
    })
}

function runQueries() {
    let sql1:string = 'select * from hero'
    // console.log('All rows by db.all():')
    // db.all(sql1, [], (err:Error|null,rows:Hero[]) => {
    //     if(err) throw err
    //     rows.forEach(row => {
    //         console.log(`id: ${row.hero_id} name: ${row.hero_name} is_xman: ${row.is_xman} was_snapped: ${row.was_snapped}`)
    //     })
    // })
    // console.log('All rows by db.all():')
    // db.each(sql1, [], (err:Error|null, row:Hero) => {
    //     if(err) throw err
    //     console.log(`id: ${row.hero_id} name: ${row.hero_name} is_xman: ${row.is_xman} was_snapped: ${row.was_snapped}`)
    // })

    // note: hero_id omitted in select result --> if you try to read it, you get undefined
    let sql2:string = `select hero_name, is_xman, was_snapped from hero h
                        inner join hero_power hp on h.hero_id = hp.hero_id
                        where hero_power = ?`
    db.all(sql2, ['Formulakuski'], (err:Error|null,rows:Hero[]) => {
        if(err) throw err
        rows.forEach(row => {
            console.log(`id: ${row.hero_id} name: ${row.hero_name} is_xman: ${row.is_xman} was_snapped: ${row.was_snapped}`)
            })
    })
}
