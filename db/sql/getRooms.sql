   SELECT MR.id, MR.roomSize, MR.roomName, MR.devices, B.fromTime, B.toTime
     FROM MeetingRoom MR 
LEFT JOIN Site S 
       ON MR.siteId=S.id
LEFT JOIN Booking B
	   ON MR.id=B.meetingRoomId
    WHERE S.id = ?
      AND ((B.fromTime >= ? AND B.toTime <= ?) OR B.fromTime is NULL)
 ORDER BY MR.id, B.fromTime