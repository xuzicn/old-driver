SELECT  MR2.*
  FROM  MeetingRoom MR2
 WHERE  MR2.id not in 
( 
      SELECT  distinct MR.Id
        FROM  MeetingRoom MR
  RIGHT JOIN  Booking B ON B.meetingRoomId=MR.Id
       WHERE (
                B.fromTime Between ? and ? or 
                B.toTime Between ? and ?
             ) 
         AND  B.meetingRoomId=?
         AND  MR.siteId=?
)