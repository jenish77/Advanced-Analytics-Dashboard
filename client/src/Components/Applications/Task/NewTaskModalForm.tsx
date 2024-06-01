import { Cancel, Save, SubTask, TaskTitle } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { addNewTask, setAddModal, setMyTask, setValidation } from "@/Redux/Reducers/TaskSlice";
import { AddTaskData } from "@/Types/TaskType";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Form, Label, Row } from "reactstrap";
import { TaskRadioRow } from "./TaskRadioRow";

export const NewTaskModalForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { validation } = useAppSelector((state) => state.task);
  const dispatch = useAppDispatch();

  const AddTask: SubmitHandler<AddTaskData> = (data) => {
    if (data.title !== "" && data.collection !== "" && data.description !== "") {
      dispatch(addNewTask(data));
      dispatch(setMyTask(data));
      dispatch(setAddModal());
      dispatch(setValidation(false));
    }
  };

  return (
    <Form className="form-bookmark needs-validation" onSubmit={handleSubmit(AddTask)}>
      <Row>
        <Col md="12" className="mb-3 mt-0">
          <Label check>{TaskTitle}</Label>
          <input type="text" className={`form-control ${validation && `${errors.title ? "is-invalid" : "is-valid"}`}`} {...register("title", {required: true,})} />
        </Col>
        <Col md="12" className="mb-3 mt-0">
          <Label check>{SubTask}</Label>
          <input type="text" className="form-control" />
        </Col>
        <TaskRadioRow />
        <Col md="6" className="mb-3 mt-0">
          <select className="form-control form-select js-example-basic-single">
            <option value="My Task">My Task</option>
          </select>
        </Col>
        <Col md="6" className="mb-3 mt-0">
          <select className={`js-example-disabled-results form-control form-select js-example-basic-single ${validation && `${errors.collections ? "is-invalid" : "is-valid"}`}`} {...register("collection", {required: true,})}>
            <option value="General">General</option>
          </select>
        </Col>
        <Col md="12" className="mb-3 col-md-12 my-0">
          <textarea className={`form-control ${validation && `${errors.description ? "is-invalid" : "is-valid"}`}`} {...register("description", {required: true,})} />
        </Col>
      </Row>
      <Button color="secondary" className="me-1" type="submit" onClick={() => dispatch(setValidation(true))}>{Save}</Button>
      <Button color="primary" onClick={() => dispatch(setAddModal())}>{Cancel}</Button>
    </Form>
  );
};
