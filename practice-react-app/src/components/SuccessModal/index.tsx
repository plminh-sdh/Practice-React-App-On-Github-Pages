import { Modal } from "react-bootstrap";

type Props = {
  showModal: boolean;
  handleCloseModal: () => void;
  title: string;
  isStatic?: boolean;
  children: React.ReactNode;
};
function SuccessModal({
  showModal,
  handleCloseModal,
  title,
  children,
  isStatic = true,
}: Readonly<Props>) {
  return (
    <Modal
      show={showModal}
      size="sm"
      className="modal-blur"
      onHide={handleCloseModal}
      backdrop={isStatic ? "static" : true}
      centered
    >
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={handleCloseModal}
      />
      <div className="modal-status bg-success"></div>
      <div className="modal-body text-center py-4">
        <h3>{title}</h3>
        <div className="text-secondary">{children}</div>
      </div>
      <Modal.Footer className="justify-content-center">
        <button
          className="btn btn-success w-100"
          data-bs-dismiss="modal"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
