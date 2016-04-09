create table Site(id int auto_increment, name varchar(100) not null, address varchar(255) not null, primary key(id) ) default CHARSET=UTF8;

insert into Site (name, address) VALUES ('维亚大厦三层', '北京市海淀区苏州街维亚大厦');
insert into Site (name, address) VALUES ('维亚大厦八层', '北京市海淀区苏州街维亚大厦');
insert into Site (name, address) VALUES ('维亚大厦九层', '北京市海淀区苏州街维亚大厦');
insert into Site (name, address) VALUES ('维亚大厦十六层', '北京市海淀区苏州街维亚大厦');
insert into Site (name, address) VALUES ('维亚大厦十七层', '北京市海淀区苏州街维亚大厦');

create table MeetingRoom(id int auto_increment, roomName varchar(100) not null, siteId int not null, address varchar(255) not null, devices varchar(255), roomSize int not null, primary key(id) ) default CHARSET=UTF8;
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0301', 1, '维亚大厦三层B区', '投影仪, 话筒, 喇叭', 20);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0302', 1, '维亚大厦三层B区', '远程会议电话', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0303', 1, '维亚大厦三层B区', '数字电话', 4);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0304', 1, '维亚大厦三层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0305', 1, '维亚大厦三层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0801', 2, '维亚大厦八层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0802', 2, '维亚大厦八层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0803', 2, '维亚大厦八层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0804', 2, '维亚大厦八层B区', '', 8);
insert into MeetingRoom (roomName, siteId, address, devices, roomSize) VALUES ('0805', 2, '维亚大厦八层B区', '', 8);

create table Booking(id int auto_increment, bookerid int not null, fromTime bigint not null, toTime bigint not null, meetingRoomId int not null, comment varchar(500), notified boolean default false, primary key(id) ) default CharSet=UTF8;
insert into Booking(bookerid, fromTime, toTime, meetingRoomId, comment) VALUES (1, 1459468800000, 1459472400000, 1, '测试测试1');
insert into Booking(bookerid, fromTime, toTime, meetingRoomId, comment) VALUES (1, 1459476000000, 1459479600000, 1, '测试测试2');
insert into Booking(bookerid, fromTime, toTime, meetingRoomId, comment) VALUES (1, 1459479600000, 1459483200000, 1, '测试测试3');

create table User(id int auto_increment, openId varchar(100) not null, name varchar(100) not null, telephone varchar(50) not null, primary key(id) ) default CharSet=UTF8;
insert into User(openId, name, telephone) VALUES ('dragonwon', '王大根', '010-12345678');
insert into User(openId, name, telephone) VALUES ('fu*ksungod', '赵日天', '010-12345678');
insert into User(openId, name, telephone) VALUES ('ejitanto', '颜值担当', '010-12345678');
