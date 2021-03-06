var pay_fine = function(app,urlencodedParser,con){
const {query} = require('../database/db');
	app.post("/fine-amount",urlencodedParser,async(req,res)=>{
		if(req.session.username && req.cookies.user_sid)
		{
			userId = req.body.userId;
			var q = "select Dues from Student where UserId="+userId;
			console.log(q);
			var dues = await query(q,con);
			var q1 = "select * from DuesDetail where UserId ="+userId+
						" and DuesPaid = 0";
			let result = await query(q1,con);
			console.log(result);
			var Details = [];
			for (let i of result) {
				console.log(i.HbookId);
				var q2 = "select * from CurrentBookStatus,"+
						"(select BookName,BookId from BookDetail) as T"+
						" where UserId=" + userId +
						" and CurrentBookStatus.HBookId="+ i.HbookId +
						" and CurrentBookStatus.BookId=T.BookId";		
				console.log(q2);
				Details.push(await query(q2,con));
			}
				console.log(Details);
				res.send({"Dues":dues,"Details":Details});
			
		}
		else
		{
			res.send({"output":"notloggedin"});
		}
	});
	app.post("/pay-fine",urlencodedParser,async(req,res)=>{
		if(req.session.adminusername && req.cookies.user_sid)
		{
			userId = req.body.userId;
			dueAmount = req.body.DueAmount;
			paidAmount = req.body.PaidAmount;
			paymentMethod = req.body.PaymentMethod;
			var q0 = "update student set Dues = Dues - "+paidAmount
					+" where UserId = " + userId;
			console.log(q0);
			let resp0 = await query(q0,con);
			var q1 = "insert into DuesBill(UserId,AmountPaid,PaymentMethod,Timestamp) values ("+
						userId+","+paidAmount+","+paymentMethod+",NOW())";
			console.log(q1);
			let resp1 = await query(q1,con);
			console.log(resp1);
			res.send("payment successfully recorded");
		}
		else
		{
			res.send({"output":"notloggedin"});
		}
	});
	
}

module.exports={pay_fine:pay_fine};