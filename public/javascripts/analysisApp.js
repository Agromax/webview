



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
								<li role="presentation"><a href="#">Overall Report</a></li>
								<li role="presentation"><a href="#">Profile</a></li>
								<li role="presentation"><a href="#">Messages</a></li>
							</ul>
						</div>
						<div className="col-md-9"></div>
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