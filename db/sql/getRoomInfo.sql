   SELECT 
     FROM MeetingRoom MR
LEFT JOIN Booking B
       ON MR.id=B.meetingRoomId
    WHERE MR.id=?
      AND ((B.fromTime Between ? AND ?) OR (B.toTime Between ? AND ?) OR (B.fromTime is NULL))