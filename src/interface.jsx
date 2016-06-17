import React from 'react';
import { BootstrapRow } from './shared';
import piexif from 'piexifjs';
import JSONTree from 'react-json-tree';

class FileInput extends React.Component {
    static propTypes = {
        handleStatusChange: React.PropTypes.func.isRequired,
        handleFileChange: React.PropTypes.func.isRequired,
        accept: React.PropTypes.string,
    }

    onChange = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const files = this.refs.fileInput.files;

        if (files && files.length && files[0]) {
            this.props.handleFileChange(files[0]);
        }
    }

    render() {
        return (<form className="form-inline" onSubmit={this.onChange}>
            <div className="form-group">
                <input ref="fileInput" type="file" required="required" accept={this.props.accept} />
            </div>
            <button type="submit" className="btn btn-default">Open catalog</button>
        </form>);
    }
}

export default class Interface extends React.Component {
    state = {
        exifObj: null,
    }

    handleFileChange = (file) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const result = fileReader.result;
            const exifObj = piexif.load(result);
            this.setState({ exifObj });
        };
        fileReader.readAsDataURL(file);
    }

    render() {
        const content = this.state.exifObj ? <JSONTree data={this.state.exifObj} /> : null;
        return (
            <BootstrapRow>
                <FileInput
                    handleFileChange={this.handleFileChange}
                    accept="image/jpeg"
                />
                {content}
            </BootstrapRow>
        );
    }
}
