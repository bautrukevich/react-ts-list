import React, { useEffect, useState, useRef, useCallback } from 'react';

interface IDataRecord {
  label: string; // uniq
  value: number;
}

interface IAppProps {
  size?: number;
}

interface IRowProps {
  data: IDataRecord;
  index: number;
  onUpdate: (index: number) => void;
}

class Row extends React.PureComponent<IRowProps> {
  renderCount = 0;

  handleUpdate = () => {
    this.props.onUpdate(this.props.index);
  };

  render() {
    const {
      data: { label, value },
    } = this.props;

    this.renderCount++;

    return (
      <div>
        <span className="label">{label}:</span>
        <span>{value}</span> <span>({this.renderCount})</span>{' '}
        <button className="button" onClick={this.handleUpdate}>
          Update
        </button>
      </div>
    );
  }
}

const Row2 = React.memo(function ({ index, data, onUpdate }: IRowProps) {
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
  });

  const { label, value } = data;
  const handleUpdate = () => {
    onUpdate(index);
  };

  return (
    <div>
      <span className="label">{label}:</span>
      <span>{value}</span> <span>({renderCount.current})</span>{' '}
      <button className="button" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
});

class App extends React.Component<IAppProps, { list: IDataRecord[] }> {
  state = {
    list: Array.from({ length: this.props.size ?? 200 }, (_el, index) => ({
      label: `label ${index + 1}`,
      value: App.generateValue(),
    })),
  };

  static generateValue() {
    return Math.round(100 + Math.random() * 900);
  }

  handleUpdate = (index: number) => {
    this.setState((prevState) => {
      return {
        list: Object.assign([], prevState.list, {
          [index]: {
            ...prevState.list[index],
            value: App.generateValue(),
          },
        }),
      };
    });
  };

  render() {
    return (
      <div>
        <h1>Test app</h1>
        {this.state.list.map((el, index) => (
          <Row2
            key={el.label}
            data={el}
            index={index}
            onUpdate={this.handleUpdate}
          />
        ))}
      </div>
    );
  }
}

export default function App2({ size }: IAppProps) {
  const generateValue = () => {
    return Math.round(100 + Math.random() * 900);
  };
  const initialList = Array.from({ length: size ?? 200 }, (_el, index) => ({
    label: `label ${index + 1}`,
    value: generateValue(),
  }));
  const [list, setList] = useState(initialList);
  const handleUpdate = useCallback((index: number) => {
    setList((prev) => {
      return Object.assign([], prev, {
        [index]: {
          ...prev[index],
          value: generateValue(),
        },
      });
    });
  }, []);

  return (
    <div>
      <h1>Test app</h1>
      {list.map((el, index) => (
        <Row2 key={el.label} data={el} index={index} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
