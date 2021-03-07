CREATE TABLE task(
    id int unsigned NOT NULL auto_increment,
    name varchar(200) NOT NULL,
    description varchar(255) NOT NULL,
    date_task datetime DEFAULT NULL,
    status int(11) DEFAULT NULL, 
    is_active int not null default 1,
    PRIMARY KEY (id)
);

create table users(
    username varchar(200) not null,
    keyValue varchar(200) default null,
    primary key(username)
);

CREATE TABLE task_user(
    id int unsigned NOT NULL,
    username varchar(200) NOT NULL,
    PRIMARY KEY (id, username),
    foreign key (id) references task(id),
    foreign key (username) references users(username)
);
