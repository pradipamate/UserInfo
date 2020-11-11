import React, { Component } from "react";
import {Addcontact,updated,RemoveItemFromList} from "./Componenet/actions/ContactInfoAction";
import {Col,Button, Container,Row,Form,Modal,Table,} from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";
import { connect } from "react-redux";
import uuid from "uuid";


const validnameregex = /^[a-zA-Z ]*$/;
const validphonenumberregex = /^[0]?[789]\d{9}$/;
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      date: "",
      phonenumber: "",
      city:"",
      editid: "",
      errors: { name: "", date: "", phonenumber: "", city: ""},
      Addcontactmodal: false,
      editcontactmodal: false,
      Deletetaskmodal: false,
      Deletetaskid: null,
    };

    this.submithandler = this.submithandler.bind(this);
    this.Edithandler = this.Edithandler.bind(this);
    this.AddInfoHandler = this.AddInfoHandler.bind(this);
    this.DeleteModalhandler = this.DeleteModalhandler.bind(this);
    this.DeleteTaskhandler = this.DeleteTaskhandler.bind(this);
  }

  AddInfoHandler = () => {
    this.setState({
      Addcontactmodal: !this.state.Addcontactmodal,
    });
  };

  modalClosehandle = (event) => {
    this.setState({
      Addcontactmodal: false,
      editcontactmodal: false,
    });
  };

  // for add Contact handler//
  changehandler = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch(name) {
        case 'name': 
        errors.name = validnameregex.test(value)? '' : 'Only Accept Characters !';
        break;
        case 'phonenumber':
        errors.phonenumber = validphonenumberregex.test(value)? '' : 'Phone Number is not valid!';
        break;
        case 'city': 
        errors.city = value.length < 0 ? 'Enter Company Name' : '';
        break;
        default:
        break;
    }
    
    this.setState({
      errors,[name]:value,
    });

  };


  //  updates change handler//
  Updatechangehandler = (event) => { 
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch(name) {
        case 'name': 
        errors.name = validnameregex.test(value)? '': 'Only Accept Characters !';
        break;
        case 'phonenumber': 
        errors.phonenumber = validphonenumberregex.test(value) ? '' : 'Phone Number is not valid!';
        break;
        case 'city':
         errors.city = value.length < 0 ? 'Enter Company Name' : '';
        break;
        default:
        break;
    }
    this.setState({
      errors,[name]:value,
    });

  };


  // for submit contact Info//
  submithandler = (event) => {
    event.preventDefault();
      this.setState({
        Addcontactmodal:!this.state.Addcontactmodal,
      });

    if(validateForm(this.state.errors)) {
            if (this.state !== "") {
              var data = {};
              data.name = this.state.name; 
              data.date = this.state.date; 
              data.city = this.state.city;
              data.phonenumber = this.state.phonenumber;
              data.id = uuid.v4();
              this.props.dispatch(Addcontact(data));
              this.setState({ name: "",date: "",phonenumber: "",city:""});
             }
          } 
     else {
          alert("Please Fill All Information");
            this.setState({
                Addcontactmodal:true
            })
       }
  };

  Edithandler = (event) => {
    var edit_id = event.target.id;
    const data = this.props.Listdata.find((item) => item.id === edit_id);
    this.setState({
      editcontactmodal: !this.state.editcontactmodal,
      editid: edit_id,
      name: data.name, 
      date: data.date,
      phonenumber: data.phonenumber,
      city: data.city,
    });
  };

  updated_submithandler = (event) => {
    event.preventDefault();
    this.setState({
      editcontactmodal: !this.state.editcontactmodal,
    });
    if (this.state!== "") {
      var newdata = {};
      newdata.id = this.state.editid; 
      newdata.name = this.state.name;
      newdata.date = this.state.date; 
      newdata.city = this.state.city;
      newdata.phonenumber = this.state.phonenumber;
      this.props.dispatch(updated(newdata));
    }
  };
  

  DeleteModalhandler = (event) => {
    this.setState({
      Deletetaskmodal: true,
      Deletetaskid: event.target.id,
    });
  };

  DeleteTaskhandler = () => {
    this.props.dispatch(RemoveItemFromList(this.state.Deletetaskid));
    this.setState({
      Deletetaskmodal: false,
    });
  };


  render() {
    const {errors} = this.state;
    var AvailableData = this.props.Listdata;
    if (AvailableData !== null) {
      var AllTaskList = AvailableData.map((item) => (
        <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.date}</td>
            <td>{item.city}</td>
            <td>{item.phonenumber}</td>
            <td><Button variant="primary mr-2 "> <i className="fa fa-pencil" aria-hidden="true" id={item.id} onClick={this.Edithandler} ></i></Button> <Button variant="danger"> <i className="fa fa-trash" aria-hidden="true" id={item.id} onClick={this.DeleteModalhandler} ></i></Button> </td>
        </tr>
      ));
    }
    return (
      <div>
        <Container fluid={true}>
            <Row className="startrow">
              <Col sm={12} xs={12}  className="view" className="text-right">
                <Button variant="success" className="themesflat-button "  onClick={this.AddInfoHandler}><i className="fa fa-plus" aria-hidden="true"></i> Add User </Button>
              </Col>
            </Row>
            <Row>
             <Col xs={12} sm={12}>
                <div className="TaskList">
                        <Table bordered responsive>
                          <thead>
                            <tr className="thead">
                              <th>Name</th>
                              <th>DOB</th>
                              <th>City</th>
                              <th>Phone</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                           <tbody style={{textAlign:'center'}}>{AllTaskList}</tbody>
                       </Table>
               </div>

      {/*  FOR CERATE USER */}
          <Modal show={this.state.Addcontactmodal} onHide={this.modalClosehandle}>
              <Modal.Header closeButton  >
                  <Modal.Title>Create User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.submithandler}>
                    <Row>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" onChange={this.changehandler} name="name"  required />
                             {errors.name.length > 0 && <span className="text-danger">{errors.name}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> DOB</Form.Label>
                          <Form.Control type="date" onChange={this.changehandler} name="date" required />
                             {errors.date.length > 0 && <span className="text-danger">{errors.date}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> City </Form.Label>
                          <Form.Control type="text" onChange={this.changehandler} name="city" required />
                             {errors.city.length > 0 && <span className="text-danger">{errors.city}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> Phone Number</Form.Label>
                          <Form.Control type="text" onChange={this.changehandler} name="phonenumber" required />
                             {errors.phonenumber.length > 0 && <span className="text-danger">{errors.phonenumber}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group className="text-right">
                          <Button variant="success" type="submit"  className="themesflat-button blue mr-2">  Save Changes </Button>
                          <Button variant="secondary" type="submit"  className="themesflat-button blue "  onClick={this.modalClosehandle}> Cancel </Button>
                        </Form.Group>
                      </Col>
                    </Row>
                </Form>
              </Modal.Body>
            </Modal>

          {/*  FOR EDIT USER */}
            <Modal show={this.state.editcontactmodal}  onHide={this.modalClosehandle}>
              <Modal.Header closeButton  >
                <Modal.Title>Edit User </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.updated_submithandler}>
                    <Row>
                      <Col sm={12}>
                        <Form.Control type="hidden"name="id" value={this.state.edit_id}/>
                        <Form.Group >
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text"  onChange={this.Updatechangehandler} name="name"  value={this.state.name}  required />
                                  {errors.name.length > 0 && <span className="text-danger">{errors.name}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> date</Form.Label>
                          <Form.Control type="date"  onChange={this.Updatechangehandler}  name="date"  value={this.state.date}  required />
                                {errors.date.length > 0 && <span className="text-danger">{errors.date}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> Company Name</Form.Label>
                          <Form.Control  type="text" onChange={this.Updatechangehandler}  name="city"  value={this.state.city}  required />
                            {errors.city.length > 0 && <span className="text-danger">{errors.city}</span>}
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group >
                          <Form.Label> Phone Number</Form.Label>
                          <Form.Control  type="text" onChange={this.Updatechangehandler}  name="phonenumber"  value={this.state.phonenumber}  required />
                          {errors.phonenumber.length > 0 && <span className="text-danger">{errors.phonenumber}</span>} 
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group className="text-right">
                          <Button variant="success" type="submit"  className="themesflat-button blue mr-2">  Save Changes </Button>
                          <Button variant="secondary" type="submit"  className="themesflat-button blue "  onClick={this.modalClosehandle}> Cancel </Button>
                        </Form.Group>
                      </Col>
                    </Row>
                </Form>
              </Modal.Body>
            </Modal>

           {/*  FOR DELETE USER */}
            <Modal show={this.state.Deletetaskmodal} onHide={this.modalClosehandle}>
              <Modal.Header
                closeButton
              ></Modal.Header>
              <Modal.Body>
                <Row>
                  <Col sm={12}>
                    <div className="DeleteModal">
                      <h4 className="mb-5"> Do you want to Delete this Record? </h4>
                      <Button
                        variant="secondary"
                        type="submit"
                        className="themesflat-button blue mr-2"
                        onClick={this.modalClosehandle}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        variant="danger"
                        id={this.state.Deletetaskid}
                        onClick={this.DeleteTaskhandler}
                      >
                        Delete
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>

          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Listdata: state.ContactInfo,
  };
};
export default connect(mapStateToProps)(App);
