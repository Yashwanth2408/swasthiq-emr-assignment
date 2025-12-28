import { gql } from "@apollo/client";

export const GET_APPOINTMENTS = gql`
  query GetAppointments($date: String, $status: String, $doctorName: String) {
    appointments(date: $date, status: $status, doctorName: $doctorName) {
      id
      patientName
      date
      time
      duration
      doctorName
      status
      mode
    }
  }
`;

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: String!) {
    appointment(id: $id) {
      id
      patientName
      date
      time
      duration
      doctorName
      status
      mode
    }
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: AppointmentInput!) {
    createAppointment(input: $input) {
      id
      patientName
      date
      time
      duration
      doctorName
      status
      mode
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: String!, $input: AppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      id
      patientName
      date
      time
      duration
      doctorName
      status
      mode
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: String!) {
    deleteAppointment(id: $id) {
      success
      message
    }
  }
`;
