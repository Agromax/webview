var VerticalSubActionsList = React.createClass({
	render: function() {
		var actionStyle = {
			minHeight: "90vh",
			maxHeight: "90vh",
			overflowY: "scroll"
		};

		var aStyle = {
			borderRadius: "0px",
			color: "#346343",
			cursor: "Pointer"
		};

		var activeStyle = {
			backgroundColor: "#69CC89",
			borderTop: "solid 1px #67C887",
			borderBottom: "solid 1px #67C887"

		};


		var actions = [];
		for(var i=0; i<this.props.versions.length; i++) {
			actions.push(
				<li><a 
					style={aStyle}
					onClick={this.props.onVersionSelected}>{this.props.versions[i]["_id"]}</a></li>
			);
		}
		
		return (
			<div style={subActionPanel}>
				<div style={actionStyle}>
					<ul className="nav nav-pills nav-stacked">
						<li>
							<a href="#" style={aStyle}>Report</a>
						</li>
						{actions}
					</ul>
				</div>
			</div>
		);
	}
});


var VerticalActionsList = React.createClass({
	render: function() {
		return (
			<div>
				<ul className="nav nav-pills nav-stacked">
					<li>
						<button type="button" className="btn btn-default action-btn" aria-label="Left Align">
  							<span className="glyphicon glyphicon-home greenish" aria-hidden="true"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default action-btn" aria-label="Left Align">
  							<span className="glyphicon glyphicon-console greenish" aria-hidden="true"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default action-btn" aria-label="Left Align">
  							<span className="glyphicon glyphicon-cog greenish" aria-hidden="true"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default action-btn" aria-label="Left Align">
  							<span className="glyphicon glyphicon-log-out greenish" aria-hidden="true"></span>
						</button>
					</li>
				</ul>
			</div>
		);
	}
});

var LeftPanel = React.createClass({
	getInitialState: function() {
		return {versions: [{id: 'Hello, World!'}]};
	},
	componentDidMount: function() {
		var self = this;

 		setInterval(function() {
 			console.log('Pinging for newer versions at: ', self.props.versionUrl);
 			$.get(self.props.versionUrl, function(data) {
 				self.setState(function(prevState, curProps) {
 					if(data.code === 0) {
 						return {versions: data.msg};
 					} else {
 						console.warn("Non Zero code returned. ", data);
 						return prevState;
 					}
 				});
 			});
 		}, 5000); 
	},
	render: function() {
		
		return (
			<div className="row">
				<div className="col-sm-2">
					<VerticalActionsList />
				</div>
				<div className="col-sm-10">
					<VerticalSubActionsList versions={this.state.versions} onVersionSelected={this.props.onVersionSelected} />
				</div>
			</div>
		);
	}
});



var Triple = React.createClass({
	getInitialState: function() {
		return {feedback: ''};
	},
	handleFeedbackChange: function(e) {
		this.setState({feedback: e.target.value});
	},
	onValueSelected: function(val) {
		// console.log("The new value => ", val);
		var tripleId = this.props.id;
		var versionId = this.props.version;

		$.post('http://localhost:3000/vc/grade', {
			triple: tripleId,
			version: versionId,
			grade: val
		}, function(data) {
			if(data.code === 0 ) {
				console.log(data.msg);
			} else {
				console.error(data.msg);
			}
		});
	},
	handleSave: function(e) {
		var tripleId = this.props.id;
		var versionId = this.props.version; 
		var feedback = this.refs.feedback.value;

		if(feedback && feedback.length > 0) {
			$.post('http://localhost:3000/vc/feedback', {
				triple: tripleId,
				version: versionId,
				feedback: feedback
			}, function(data) {
				if(data.code === 0 ) {
					console.log(data.msg);
				} else {
					console.error(data.msg);
				}
			});
		}
	},
	componentDidMount: function() {
		var self = this;
	    var t = this.props.triple;
		var grade = t.grades.find(function(g) {
			if(g.user) {
				return g.user.toString() === self.props.user.id.toString(); 
			}
			return false;
		}) || {};

		var feedback = grade.feedback || '';
		this.setState({feedback: feedback});
	},
	render: function() {
		var self = this;
		var t = this.props.triple;
		var grade = t.grades.find(function(g) {
			if(g.user) {
				return g.user.toString() === self.props.user.id.toString(); 
			}
			return false;
		}) || {};

		var level = grade.value || -1;

		return (
			<div className="row" style={tripleStyle}>
				<div className="col-sm-12">
					<div className="row">
						<div className="col-sm-12">
							<form className="form-horizontal" role="form">
								<div className="form-group">
								    <label className="control-label col-sm-2" for="">Triple</label>
								    <div className="col-sm-10">
								    	<div className="row">
									    	<div className="col-sm-4">{t.sub}</div>
											<div className="col-sm-4">{t.pre}</div>
											<div className="col-sm-4">{t.obj}</div>
										</div>
								    </div>
								</div>

								<div className="form-group">
								    <label className="control-label col-sm-2" for="">Grade</label>
								    <div className="col-sm-10">
								    	<Slider initialLevel={level} onValueSelected={this.onValueSelected}/>
								    </div>
								</div>

								<div className="form-group">
								    <label className="control-label col-sm-2" for="">Feedback</label>
								    <div className="col-sm-10">
								    	<textarea placeholder="Write your feedback" ref="feedback" onChange={this.handleFeedbackChange} value={this.state.feedback}></textarea>
								    </div>
								</div>

								<div className="form-group">
									<label className="control-label col-sm-2" for=""></label>
								    <div className="col-sm-1">
								    	<button type="button" className="btn btn-default" onClick={this.handleSave}>
											<span className="glyphicon glyphicon-ok greenish"></span>&nbsp;&nbsp;Save
										</button>
								    </div>
									<div className="col-sm-1">
								    	<button type="button" className="btn btn-default">
											<span className="glyphicon glyphicon-trash greenish"></span>&nbsp;&nbsp;Discard
										</button>
								    </div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});	


var RightPanel = React.createClass({
	render: function()  {
		var ts = {sub: 'Indian whete ksjfksfdkhfd jhf hfjh fjdhfj hdjfhdjh fjdhfjdhf jdhf jdhf jdhf jdhfdjjjjjjjjjjjjjjjjjjjjjjjjfhdjhf jdhfjdhf djfhj hdjfhj hdjfh', pred: 'wheet-bla-bla-bla-bla-foo+-bar', obj: 'tastes_sweet'}
		var triplets = [];


		for(var i=0; i<this.props.triplets.length; i++) {
			triplets.push(
				<Triple 
					triple={this.props.triplets[i]} 
					id={this.props.triplets[i]['_id']} 
					version={this.props.version}
					user={this.props.user}
					 />
			);
		}

		return (
			<div className='right-panel' >
				{triplets}
			</div>
		);
	}
});


var Dashboard = React.createClass({
	getInitialState: function() {
		return {triplets: [], version: '', user: {id: '', username: ''}};
	},
	onVersionSelected: function(vId) {
		// console.warn(JSON.stringify(vId.target.innerHTML));
		var versionId = vId.target.innerHTML;
		var self = this;
		$.get('http://localhost:3000/vc/version?id='+versionId, function(data) {
			if(data) {
				console.warn(JSON.stringify(data.msg));
				self.setState(function(cs, curProps) {
					return {triplets: data.msg.triplets, version: data.msg["_id"], user: data.msg.user};
				});
			} else {
				console.warn('No data found');
			}
 		});	
	},
	render: function() {
		return (
			<div className="container-fluid">
				<div className='row'>
					<div className="col-md-12" style={headerStyle}>
						<div  className="row">
							<div className="col-md-3">
								<div>
									<h3>
									  	<span className="glyphicon glyphicon-stats blueish" aria-hidden="true"></span> dashboard
									</h3>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-12">
						<div className='row'>
							<div className="col-md-3" style={leftPanel}>
								<LeftPanel versionUrl='http://localhost:3000/vc/versions' onVersionSelected={this.onVersionSelected} />
							</div>
							<div className="col-md-9">
								<RightPanel triplets={this.state.triplets} version={this.state.version} user={this.state.user}/>
							</div>
						</div>
					</div>
				</div>				
			</div>
		);
	}
});	



$(document).ready(function () {
    ReactDOM.render(
        <Dashboard />,
        document.getElementById('dashboard-content')
    );
});