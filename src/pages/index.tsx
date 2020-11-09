import * as React from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel
} from "@material-ui/core";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { object, mixed, number, string } from "yup";

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children);
  const [current, setCurrent] = React.useState(0);
  const currentChild = childrenArray[current] as React.ReactElement<
    FormikStepProps
  >;

  const isLastStep = () => {
    return current === childrenArray.length - 1;
  };

  return (
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
        } else {
          setCurrent((prev) => prev + 1);
        }
      }}
      validationSchema={currentChild.props.validationSchema}
    >
      <Form autoComplete="off">
        <Stepper alternativeLabel activeStep={current}>
          {childrenArray.map((child) => {
            if (React.isValidElement<FormikValues>(child)) {
              return (
                <Step key={child.props.label}>
                  <StepLabel>{child.props.label}</StepLabel>
                </Step>
              );
            }
          })}
        </Stepper>
        {currentChild}
        <div className="navigate-button-row">
          {current > 0 ? (
            <Button
              color="primary"
              variant="contained"
              onClick={() => setCurrent((prev) => prev - 1)}
            >
              Back
            </Button>
          ) : null}
          <Button type="submit" color="primary" variant="contained">
            {isLastStep() ? "Submit" : "Next"}
          </Button>
        </div>
      </Form>
    </Formik>
  );
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

export function FormikStep({ children, ...props }: FormikStepProps) {
  return <>{children}</>;
}

const Home: React.FC = () => {
  return (
    <>
      <Card>
        <CardContent>
          <FormikStepper
            initialValues={{
              firstName: "",
              lastName: "",
              millionaire: false,
              money: "",
              description: ""
            }}
            onSubmit={() => {}}
          >
            <FormikStep
              label="Basic Info"
              validationSchema={object({
                firstName: string().required("First name is required"),
                lastName: string().required("Last name is required")
              })}
            >
              <Box paddingBottom={2}>
                <Field
                  fullWidth
                  name="firstName"
                  component={TextField}
                  label="First Name"
                />
              </Box>
              <Box paddingBottom={2}>
                <Field
                  fullWidth
                  name="lastName"
                  component={TextField}
                  label="Last Name"
                />
              </Box>
            </FormikStep>
            <FormikStep
              label="Wealth Info"
              validationSchema={object({
                money: mixed().when("millionaire", {
                  is: true,
                  then: number()
                    .required()
                    .min(1000000, "Money should be minimum 1,000,000"),
                  otherwise: number().required()
                })
              })}
            >
              <Box paddingBottom={2}>
                <Field
                  name="millionaire"
                  type="checkbox"
                  component={CheckboxWithLabel}
                  Label={{ label: "Millionaire" }}
                />
              </Box>
              <Box paddingBottom={2}>
                <Field
                  fullWidth
                  name="money"
                  component={TextField}
                  type="number"
                  label="Money"
                />
              </Box>
            </FormikStep>
            <FormikStep
              label="More Info"
              validationSchema={object({
                description: string().required("Description is required")
              })}
            >
              <Box paddingBottom={2}>
                <Field
                  fullWidth
                  name="description"
                  component={TextField}
                  label="Description"
                />
              </Box>
            </FormikStep>
          </FormikStepper>
        </CardContent>
      </Card>
    </>
  );
};

export default Home;
