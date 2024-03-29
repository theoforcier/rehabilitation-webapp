import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilSquare, faCheck, faPlus} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Card, Col, Modal, Spinner } from "react-bootstrap";
import "./Tasks.css";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { getHTTP, putHTTP, deleteHTTP, postHTTP } from "../../api/helpers";

const CustomTaskCard = () => {
  // List of custom tasks
  const [customTasks, setCustomTasks] = useState(null);
  // Task being edited
  const [editTask, setEditTask] = useState(null);
  // Task being created
  const [newTask, setNewTask] = useState({ description: "" });
  // Boolean to show a modal
  const [showModal, setShowModal] = useState(false);
  // Boolean for which modal (edit modal or create modal)
  const [isEditing, setIsEditing] = useState(true);

  // Fetch and store a user's uncompleted custom tasks
  useEffect(() => {
    let payload = {
      completed: 0
    }
    getHTTP("user/tasks/custom", payload).then((response) => {
      if (response.success) {
        setCustomTasks(response.data.tasks);
      }
    });
  }, []);

  // Function called when modal is closed
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // On click handler for editing a task
  const handleEdit = (task) => {
    setEditTask(task);
    setIsEditing(true);
    setShowModal(true);
  };

  // On click handler for creating a task
  const handleCreate = () => {
    setIsEditing(false);
    setShowModal(true);
  }

  const markTaskUpdating = (taskId, value) => {
    setCustomTasks(customTasks.map(task => {
      if (task.id == taskId)
        task.updating = value;
      return task;
    }))
  }

  // Save task using current editTask description
  const saveTask = () => {
    let payload = {
      description: editTask.description
    }

    markTaskUpdating(editTask.id, true)

    putHTTP("user/tasks/custom/" + editTask.id + "/rename", payload).then((response) => {
      if (response.success) {
        const updatedCustomTasks = [...customTasks];
        const taskIndex = updatedCustomTasks.findIndex((task) => task.id == editTask.id);
        updatedCustomTasks[taskIndex].description = editTask.description;
        setCustomTasks(updatedCustomTasks);
      }

      markTaskUpdating(editTask.id, false)
    });
    setShowModal(false);
  };

  // Delete task by task ID
  const deleteTask = (taskId) => {

    markTaskUpdating(taskId, true)

    deleteHTTP("user/tasks/custom/" + taskId).then((response) => {
      if (response.success) {
        setCustomTasks(customTasks.filter((task) => task.id != taskId));
      } else {
        markTaskUpdating(taskId, false)
      }
    });
    setShowModal(false);
  };

  // Add task using current newTask description
  const addTask = () => {
    let payload = {
      description: newTask.description
    };
    postHTTP("user/tasks/custom", payload).then((response) => {
      if (response.success) {
        setCustomTasks([...customTasks, response.data]);
      }
    });
    setShowModal(false);
  };

  // Complete task by task ID
  const completeTask = (taskId) => {
    markTaskUpdating(taskId, true)

    putHTTP("user/tasks/custom/" + taskId + "/complete").then((response) => {
      if (response.success) {
        setCustomTasks(customTasks.filter((task) => task.id != taskId));
      } else {
        markTaskUpdating(taskId, false)
      }
    });
  }

  return (
    <div>
      <div className="task-section">
        <Col>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center"> 
              <span>Custom Tasks</span>
              <span>
                <Button className="btn-main"onClick={ () => handleCreate() }>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </span>
            </CardHeader>
            <Card.Body>
              {customTasks != null ? 

                customTasks.length > 0 ? 

                  customTasks.map((task, index) => (
                    <div key={task.id}>
    
                      <div className="d-flex justify-content-between mt-2">
    
                        <div>
                          <Card.Title>{task.description}</Card.Title>
                          <Card.Subtitle>
                            {task.points_reward} points
                          </Card.Subtitle>
                        </div>
    
                        <Card.Text>
                          <span>

                            {task.updating && 
                              <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                            }

                            <Button
                              className="btn-main"
                              disabled={task.updating}
                              onClick={ () => handleEdit(task) }
                              style={{ marginRight: "5px" }}
                            >
                              <FontAwesomeIcon icon={faPencilSquare} className="me-2" />
                              Edit
                            </Button>
                            <Button 
                              className="btn-main"
                              disabled={task.updating}
                              onClick={ () => completeTask(task.id) }
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                          </span>
                        </Card.Text>
    
                      </div>
    
                      { (index != (customTasks.length - 1)) ? <hr/> : null }
    
                    </div>
                  ))
                
                : <div>Click + to create a new task!</div>
            
              : "Loading..."}
            </Card.Body>
          </Card>
        </Col>
      </div>
      <div>
        <Modal show={showModal} onHide={handleCloseModal}>
          {isEditing ? (
            <div>
            <Modal.Header closeButton>
              <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTaskGoal">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                  type="test"
                  defaultValue={editTask ? editTask.description : ""}
                  onChange={(e) => {
                    const newTask = { ...editTask, description: e.target.value };
                    setEditTask(newTask);
                  }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={ () => deleteTask(editTask.id) }>
                Delete
              </Button>
              <Button variant="primary" onClick={ () => saveTask(editTask.id) }>
                Save Changes
              </Button>
            </Modal.Footer>
            </div>
          ) : (
            <div>
              <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formTaskGoal">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-main" onClick={ () => addTask() }>
                  Add Task
                </Button>
              </Modal.Footer>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CustomTaskCard;
