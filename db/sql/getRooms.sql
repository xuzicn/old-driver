   SELECT MR.id, MR.roomSize, MR.roomName, MR.devices, B.fromTime, B.toTime
     FROM MeetingRoom MR 
LEFT JOIN Site S 
       ON MR.siteId=S.id
LEFT JOIN Booking B
	   ON MR.id=B.meetingRoomId
    WHERE S.id = ?
 ORDER BY MR.id, B.fromTime