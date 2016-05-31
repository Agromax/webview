var LeftPanel = React.createClass({
	render: function() {
		var versions = this.props.versions;
		var actions  = [];
		var self  	 = this;

		versions.forEach(function(v) {
			actions.push(
				<li 
					role="presentation" 
					key={v["_id"]} 
					className={self.props.selected === v["_id"] ? 'active': ''}>
					<a href="#" onClick={self.props.onVersionSelected}>{v["_id"]}</a>
				</li>
			);
		});

		return (
			<div>
				<ul className="nav nav-pills nav-stacked">
					<li role="presentation" className="help" key='Message'>Given below is the list of all the versions available. Please select a version to grade. Please note that this page is intended to be used by a domain expert only</li>
					{actions}
				</ul>
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
		var self = this;									// For reasons untold
		var t = this.props.triple;							// Triple to be rendered
		var grade = t.grades.find(function(g) {
			if(g.user) {									// Find the grading by the current Domain Expert(DE)
				return g.user.toString() === self.props.user.id.toString(); 
			}
			return false;
		}) || {};

		var level = grade.value || -1;						// Grade level assigned by the DE

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Triple &raquo;&nbsp;<span className='light'>{this.props.triple['_id']}</span></div>
				<div className="panel-body">
					<div className="row">
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
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});	


var RightPanel = React.createClass({
	render: function()  {
		var triplets = [];

		for(var i=0; i<this.props.triplets.length; i++) {
			triplets.push(
				<Triple 
					triple={this.props.triplets[i]} 
					id={this.props.triplets[i]['_id']} 
					key={this.props.triplets[i]['_id']}
					version={this.props.version}
					user={this.props.user}
				/>
			);
		}

		return (
			<div className='right-panel'>
				{triplets}
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
	          },
	          user: {
	          	id: '', 
	          	username: ''
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
				},
				user: v.user
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
		window.location = "/app/analysis";
	},
	render: function() {
		return (
			<div>					
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">Dashboard</a>
						<ul className="nav navbar-nav navbar-right">
					        <li className="dropdown">
					        	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.curUser.name} <span className="caret"></span></a>
						        <ul className="dropdown-menu">
						        	<li><a href="#"><span className="glyphicon glyphicon-cog"></span>&nbsp;&nbsp;Settings</a></li>
						        	<li role="separator" className="divider"></li>
						        	<li><a href="/users/logout"><span className="glyphicon glyphicon-log-out"></span>&nbsp;&nbsp;Logout</a></li>
						        </ul>
					        </li>
				      	</ul>
				      	<div className="nav navbar-nav navbar-right">
				      		<button type="button" className="btn btn-default navbar-btn" onClick={this.handleBack}>Go to Analysis</button>
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
						<div className="col-md-9 right-nav">
							<RightPanel 
								triplets={this.state.version.triplets} 
								version={this.state.selected} 
								user={this.state.user}
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
		        document.getElementById('dashboard-content')
		    );
		}
	});
    
});