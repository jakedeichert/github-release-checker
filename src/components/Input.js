import { React, pt, styled } from 'utils/component';

const Wrapper = styled.div`
  padding: 10px;
  width: ${p => `${p.width}px`};
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  margin: 0 0 2px;
  text-align: left;
`;

const InputBox = styled.input`
  border: 2px solid #c377f2;
  display: block;
  font-size: 18px;
  margin: 0 auto;
  padding: 4px 5px;
  width: 100%;
  &:focus {
    border: 2px solid #8c14d7;
  }
`;

export default class Input extends React.Component {
  static propTypes = {
    type: pt.string,
    width: pt.number,
    value: pt.string,
    label: pt.string,
    onChange: pt.func,
  };
  static defaultProps = {
    type: 'text',
    width: 300,
    onChange: null,
  };
  state = {
    value: '',
  };

  render() {
    const { type, value, label, width } = this.props;
    return (
      <Wrapper width={width}>
        <Label htmlFor={label}>{label}</Label>
        <InputBox
          id={label}
          type={type}
          value={this.state.value || value}
          onChange={this.handleChange}
        />
      </Wrapper>
    );
  }

  handleChange = e => {
    const { onChange } = this.props;
    const val = e.target.value;
    if (onChange) return onChange(val);
    this.setState({
      value: val,
    });
  };
}
