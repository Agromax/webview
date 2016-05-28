
var SummaryPanel = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">Summary</div>
				<div className="panel-body">
					<form className="form-horizontal">
						<div className="form-group">
							<label className="control-label col-sm-2 align-right">Version ID</label>
							<div className="col-sm-10">
								<input type="text"  className="form-control disabled disabled-text-ctl" value={this.props.version}></input>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label col-sm-2 align-right">Description</label>
							<div className="col-sm-10">
								<input type="text"  className="form-control disabled disabled-text-ctl" value={this.props.desc || 'Not Available'}></input>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label col-sm-2 align-right">Created</label>
							<div className="col-sm-10">
								<input type="text"  className="form-control disabled disabled-text-ctl" value={moment(this.props.ts).fromNow()}></input>
							</div>
						</div>
						<div className="form-group">
							<label className="control-label col-sm-2 align-right">No of Triples</label>
							<div className="col-sm-10">
								<input type="text"  className="form-control disabled disabled-text-ctl" value={this.props.count || 0}></input>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
});


var BarChart = React.createClass({
	getData: function() {  
		var triplets = this.props.triplets;
		var values = [];
		for(var i=0; i<=10; i++) {
			values.push(0);
		}

		triplets.forEach(function(t) {
			var gradeSum = 0;		// The sum of the grades assigned by all the DE's
			var graded   = 0;		// Only consider the grading if the DE actually assigned a grade

			t.grades.forEach(function(g) {
				if(g.value && g.value <= 10 && g.value >= 0) {
					gradeSum += g.value;
					graded++;
				}
			});
			if(graded > 0) {
				var avgGrade = parseInt(gradeSum / graded);
				values[avgGrade] += 1;
			}
		});

		// Lets normalize the data, and convert each data point
		// to a percent value
		if(triplets.length > 0) {
			for(var grade = 0; grade <= 10; grade ++) {
				values[grade] = parseInt((values[grade] / triplets.length) * 100.0);
			}
		}

		return values;
	},
	render: function() {
		var data = this.getData();			// Get the fraction of each grade triples
		var bars = [];
		var self = this;

		for(var grade = 0; grade <= 10; grade ++) {
			var width = data[grade] + '%';
			var style = {width: width};
			bars.push(
				<div className="form-group">
					<label className="control-label col-sm-2 align-right">{'Grade ' + grade}</label>
					<div className="col-sm-10">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={style}>{width}</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div>
				<form className="form-horizontal">
					{bars}
				</form>
			</div>
		);
	}
});


var RightPanel = React.createClass({
	getInitialState: function() {
		return {
			id: null,
			desc: null,
			ts: null,
			triplets: []
		};
	},
	loadVersion: function(versionId, callback) {
		$.get(this.props.versionUrl + '?id='+versionId, function(data) {
			if(data.code === 0) {
				var v = data.msg;
				callback(v);
			} else {
				console.warn(data.msg);
			}
		});
	},
	componentDidMount: function() {
		var versionId = this.props.version;
		var self = this;

		this.loadVersion(versionId, function(v) {
			console.warn(v);
			self.setState({
				id: v["_id"].toString(), 
				desc: v.desc, 
				ts: v.ts, 
				triplets: v.triplets
			});
		});
	},
	render: function() {
		return (
			<div className="right-nav">
				<SummaryPanel version={this.state.id} ts={this.state.ts} desc={this.state.desc}/>
				<BarChart triplets={this.state.triplets}/>
			</div>
		);
	}
});


var Dashboard = React.createClass({
	onVersionSelected: function(vId) {
		
	},
	render: function() {
		return (
			<div>					
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">Analysis</a>
						<ul className="nav navbar-nav navbar-right">
					        <li className="dropdown">
					        	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.curUser.name} <span className="caret"></span></a>
						        <ul className="dropdown-menu">
						        	<li><a href="#"><span className="glyphicon glyphicon-cog"></span>&nbsp;&nbsp;Settings</a></li>
						        	<li role="separator" className="divider"></li>
						        	<li><a href="#"><span className="glyphicon glyphicon-log-out"></span>&nbsp;&nbsp;Logout</a></li>
						        </ul>
					        </li>
				      	</ul>
					</div>
				</nav>
				<div className="container-fluid">
					<div className='row'>
						<div className="col-md-3 left-nav">
							<ul className="nav nav-pills nav-stacked">
								<li role="presentation" className="active"><a href="#">Overall Report</a></li>
								<li role="presentation"><a href="#">Profile</a></li>
								<li role="presentation"><a href="#">Messages</a></li>
							</ul>
						</div>
						<div className="col-md-9">
							<RightPanel versionUrl='http://localhost:3000/vc/version' version={'57444af0e6b8eed8280e4114'}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});	


$(document).ready(function () {
	$.get('/users/me', function(data) {
		if(data.code === 0) {
			ReactDOM.render(
		        <Dashboard curUser={data.msg} />,
		        document.getElementById('content')
		    );
		}
	});
});