const Marty = require('marty');
const GraphConstants = require('../constants/GraphConstants');
const Graph = require('../models/Graph');
const mapData = require('../../test/support/sampleData').mitchellMap; // TODO: unmock this!
const Immutable = require('immutable');
const _ = require('lodash');

class GraphStore extends Marty.Store {
  constructor(options){
    super(options);
    const nullGraph = new Graph({});
    this.state = Immutable.fromJS({
      graphs: { [nullGraph.id]: nullGraph },
      currentGraphID: nullGraph.id
    });
    this.handlers = {
      moveEdge: GraphConstants.MOVE_EDGE,
      addGraph: GraphConstants.RECEIVE_GRAPH_DONE,
      setCurrentGraph: GraphConstants.SHOW_GRAPH,
      addNode: GraphConstants.ADD_NODE,
      moveNode: GraphConstants.MOVE_NODE
    };
  }

  //Graph methods
  addGraph(graph){
    this.replaceState(
      this.state.mergeDeep(
        Immutable.Map({graphs: Immutable.Map({[graph.id]: graph})})));
  }
  setCurrentGraph(id){
    this.replaceState(
      this.state.merge(
        Immutable.Map({currentGraphID: id})));
  }
  getCurrentGraph(){
    const id = this.state.get('currentGraphID');
    return this.getGraph(id);
  }
  getGraph(id){
    return this.fetch({
      id: id,
      locally: () => this.state.getIn(['graphs', id.toString()]),
      remotely: () => this.app.graphQueries.getGraph(id)
    });
  }

  //Node methods
  addNode(node){
    const cg = this.getCurrentGraph().result;
    this.replaceState(
      this.state.mergeDeep(
        Immutable.Map({graphs: Immutable.Map({
          [cg.id]: cg.addNode(node)})})));
    this.hasChanged();
  }
  moveNode(nodeId, position){
    const cg = this.getCurrentGraph().result;
    this.replaceState(
      this.state.mergeDeep(
        Immutable.Map({ graphs: Immutable.Map({
          [cg.id]: cg.moveNode(nodeId, position)})})));
    this.hasChanged();
  }
  moveEdge(id, x, y, cx, cy){
    this.state.graph = this.state.graph.moveEdge(id, x, y, cx, cy);
    this.hasChanged();
  }
  getNode(graphId, nodeId){
    return this.state.get('graphs').get(graphId).nodes.get(nodeId);
  }

  //Edge methods
  getEdge(graphId, edgeId){
    return this.state.get('graphs').get(graphId).edges.get(edgeId);
  }
}

module.exports = GraphStore;