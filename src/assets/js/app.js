var React = require('react');
var ReactDOM = require('react-dom');


var WelcomeText = React.createClass({
	render: function() {
		return (
			<p className="WelcomeText">Tewley</p>
		);
	}
})

var App = React.createClass({
	render: function() {
		return (
			<div className="App">
			Hello, world! Just call me <WelcomeText />
			</div>
		)
	}
});

ReactDOM.render(<App />, document.getElementById('app'));