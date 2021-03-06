var catalogue = function(app,urlencodedParser,con){

	app.post("/catalogue",urlencodedParser,function(req,res){
		if(req.session.username && req.cookies.user_sid)
		{
			var q = "select * from BookDetail";
			con.query(q,function(err,resp){
				if(err)
					throw err;
				output = JSON.parse(JSON.stringify(resp));
				if(output.length == 0)
					res.send("No books found");
				else
					res.send({"book-details":output});
			});
		}
		else
		{
			res.send({"output":"notloggedin"});
		}
	});
}

module.exports={catalogue:catalogue};