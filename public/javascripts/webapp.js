
var RatingValue = React.createClass({
	render: function() {
		return (
			<span className={this.props.ratingClass} onClick={this.props.onSelected}>
				{this.props.value}
			</span>
		);
	}
});


var SelectableRatingList = React.createClass({
	render: function() {
		var ratingValues = [];
		var minRating = this.props.minRating || 0;
		var maxRating = this.props.maxRating || 5;
		var step 	  = this.props.step || 1;
		var selectedLevel = this.props.selectedLevel || (minRating-1);

		if(step <= 0) {
			console.error('Illegal step value: ' + step + ', using default value as 1');
			step = 1;
		}

		for(var i = minRating; i <= maxRating; i += step) {
			if(i <= selectedLevel) {
				ratingValues.push((
					<RatingValue value={i} ratingClass="rating-value-active" onSelected={this.props.onValueSelected}/>
				));
			} else {
				ratingValues.push((
					<RatingValue value={i} ratingClass="rating-value" onSelected={this.props.onValueSelected}/>
				));
			}
		}
		return (
			<div>
				{ratingValues}
			</div>
		);
	}
});


var RatingView = React.createClass({

	getInitialState: function() {
		return {
			level: (this.props.minValue-1) || -1
		};
	},

	valueSelected: function(e) {
		var val = parseInt(e.target.innerHTML);
		this.setState(function(prevState, curProps) {
			return {level: val};
		});
	}, 

	render: function() {
		return (
			<SelectableRatingList 
				minRating={this.props.minRating}
				maxRating={this.props.maxRating}
				step={this.props.step}
				onValueSelected={this.valueSelected}
				selectedLevel={this.state.level}
			/>
		);
	}
});


var Slider = React.createClass({
	render: function() {
		return (
			<div className="slider">
				<RatingView maxRating={10} step={1} />
			</div>
		);
	}
});

window.Slider = Slider;
// $(document).ready(function () {
//     ReactDOM.render(
//         <Slider/>,
//         document.getElementById('content')
//     );
// });