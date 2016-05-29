
var SummaryPanel = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">Summary of this version</div>
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
			var style = {width: width, backgroundColor: '#70DB93'};
			bars.push(
				<div className="form-group">
					<label className="control-label col-sm-2 align-right">{'Grade ' + grade}</label>
					<div className="col-sm-10">
						<div className="progress">
							<div className="progress-bar green" role="progressbar" style={style}>{width}</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">{this.props.title}</div>
				<div className="panel-body">
					<form className="form-horizontal">
						{bars}
					</form>
				</div>
			</div>
		);
	}
});


var RightPanel = React.createClass({
	render: function() {
		return (
			<div className="right-nav">
				<SummaryPanel 
					version={this.props.version} 
					ts={this.props.ts} 
					desc={this.props.desc} 
					count={this.props.triplets.length}
				/>
				<BarChart triplets={this.props.triplets} title='Frequency of individual grade'/>
			</div>
		);
	}
});


var LeftPanel = React.createClass({
	render: function() {
		var versions = this.props.versions;
		var actions 	 = [];
		var self  	 = this;

		versions.forEach(function(v) {
			actions.push(
				<li role="presentation" key={v["_id"]} className={self.props.selected === v["_id"] ? 'active': ''}>
					<a href="#" onClick={self.props.onVersionSelected}>{v["_id"]}</a>
				</li>
			);
		});

		return (
			<div>
				<ul className="nav nav-pills nav-stacked">
					<li role="presentation" className="help">Given below is the list of all the versions available. Please select a version to view details</li>
					{actions}
				</ul>
			</div>
		);
	}
});


var Dashboard = React.createClass({
	getInitialState: function() {
	    return {
	          selected: '',
	          versionList: [],
	          version: {
	          	ts: '',
	          	desc: '',
	          	triplets: []
	          }
	    };
	},
	loadIndividualVersion: function(versionId, callback) {
		$.get('http://localhost:3000/vc/version?id='+versionId, function(data) {
			if(data.code === 0) {
				var v = data.msg;
				callback(v);
			} else {
				console.warn(data.msg);
			}
		});
	},
	handleVersionSelection: function(e) {
		var versionId = e.target.innerHTML;
		var self 	  = this;

		console.log("Selected version ", versionId);
		self.setState({selected: versionId});
		self.loadIndividualVersion(versionId, function(v) {
			self.setState({
				version: {
					ts      : v["ts"],
					desc    : v.desc,
					triplets: v.triplets
				}
			});
		});

	},
	loadVersions: function(url, callback) {
		$.get(url, function(data) {
			if(data.code === 0) {
				callback(data.msg);
			} else {
				console.log(data.msg);
			}
		});
	},
	componentDidMount: function() {
		var self = this;
		self.loadVersions('http://localhost:3000/vc/versions', function(vs) {
			self.setState({versionList: vs});
		});
	},
	handleBack: function(e) {
		window.location = "/app/dashboard";
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
				      	<div className="nav navbar-nav navbar-right">
				      		<button type="button" className="btn btn-default navbar-btn" onClick={this.handleBack}><span className="glyphicon glyphicon-arrow-left"></span>&nbsp;&nbsp;Back to Dashboard</button>
				      	</div>
					</div>
				</nav>
				<div className="container-fluid">
					<div className='row'>
						<div className="col-md-3 left-nav">
							<LeftPanel 
								versions={this.state.versionList} 
								selected={this.state.selected} 
								onVersionSelected={this.handleVersionSelection}
							/>
						</div>
						<div className="col-md-9">
							<RightPanel
								version={this.state.selected} 
								ts={this.state.version.ts}
								desc={this.state.version.desc}
								triplets={this.state.version.triplets}
							/>
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