var VerticalSubActionsList = React.createClass({
	render: function() {
		var actionStyle = {
			minHeight: "100vh",
			maxHeight: "100vh",
			overflowY: "scroll"
		};

		var aStyle = {
			borderRadius: "0px",
			color: "#346343"
		};

		var activeStyle = {
			backgroundColor: "#69CC89",
			borderTop: "solid 1px #67C887",
			borderBottom: "solid 1px #67C887"

		};


		var actions = [];
		for(var i=0; i<5; i++) {
			actions.push(
				<li><a href="" style={aStyle}>{'Version-'+i}</a></li>
			);
		}
		
		return (
			<div style={subActionPanel}>
				<div style={actionStyle}>
					<ul className="nav nav-pills nav-stacked">
						<li>
							<a href="#" style={aStyle}>Report</a>
						</li>
						<li style={activeStyle}>
							<a href="#" style={aStyle}>Current Version</a>
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
	render: function() {
		return (
			<div className="row">
				<div className="col-sm-2">
					<VerticalActionsList />
				</div>
				<div className="col-sm-10">
					<VerticalSubActionsList />
				</div>
			</div>
		);
	}
});



var Triple = React.createClass({
	render: function() {
		var t = this.props.triple;

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
											<div className="col-sm-4">{t.pred}</div>
											<div className="col-sm-4">{t.obj}</div>
										</div>
								    </div>
								</div>

								<div className="form-group">
								    <label className="control-label col-sm-2" for="">Grade</label>
								    <div className="col-sm-10">
								    	<Slider />
								    </div>
								</div>

								<div className="form-group">
								    <label className="control-label col-sm-2" for="">Feedback</label>
								    <div className="col-sm-10">
								    	<textarea placeholder="Write your feedback"></textarea>
								    </div>
								</div>

								<div className="form-group">
									<label className="control-label col-sm-2" for=""></label>
								    <div className="col-sm-1">
								    	<button type="button" className="btn btn-default">
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

		for(var i=0; i<10; i++) {
			triplets.push(
				<Triple triple={ts} />
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
	render: function() {
		return (
			<div className="container-fluid">
				<div className='row'>
					<div className="col-md-3" style={leftPanel}>
						<LeftPanel />
					</div>
					<div className="col-md-9">
						<RightPanel />
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