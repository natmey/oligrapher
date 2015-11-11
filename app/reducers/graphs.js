import { LOAD_GRAPH, SHOW_GRAPH, 
         MOVE_NODE, MOVE_EDGE, MOVE_CAPTION, 
         SWAP_NODE_HIGHLIGHT, SWAP_EDGE_HIGHLIGHT,
         ADD_NODE, ADD_EDGE, DELETE_NODE, DELETE_EDGE } from '../actions';
import Graph from '../models/Graph';
import Edge from '../models/Edge';
import { merge } from 'lodash';

export default function graphs(state = {}, action) {
  let newState;

  switch (action.type) {

  case LOAD_GRAPH:
    let graph = Graph.prepare(action.graph);
    return merge({}, state, { [graph.id]: graph });

  case MOVE_NODE:
    return merge({}, state, { 
      [action.graphId]: Graph.moveNode(state[action.graphId], action.nodeId, action.x, action.y) 
    });

  case MOVE_EDGE:
    return merge({}, state, { 
      [action.graphId]: Graph.moveEdge(state[action.graphId], action.edgeId, action.cx, action.cy) 
    });

  case MOVE_CAPTION:
    return merge({}, state, { 
      [action.graphId]: Graph.moveCaption(state[action.graphId], action.captionId, action.x, action.y) 
    });

  case SWAP_NODE_HIGHLIGHT:
    return merge({}, state, { 
      [action.graphId]: Graph.swapNodeHighlight(state[action.graphId], action.nodeId, action.singleSelect) 
    });

  case SWAP_EDGE_HIGHLIGHT:
    return merge({}, state, { 
      [action.graphId]: Graph.swapEdgeHighlight(state[action.graphId], action.edgeId, action.singleSelect) 
    });

  case ADD_NODE:
    return merge({}, state, { 
      [action.graphId]: Graph.addNode(state[action.graphId], action.node) 
    });

  case ADD_EDGE:
    return merge({}, state, { 
      [action.graphId]: Graph.addEdge(state[action.graphId], action.edge)
    });

  case DELETE_NODE:
    // simple merge won't work in this case because it doesn't remove objects
    newState = merge({}, state);
    newState[action.graphId] = Graph.deleteNode(state[action.graphId], action.nodeId);
    return newState;

  case DELETE_EDGE:
    // simple merge won't work in this case because it doesn't remove objects
    newState = merge({}, state);
    newState[action.graphId] = Graph.deleteEdge(state[action.graphId], action.edgeId);
    return newState;

  default:
    return state;
  }
}