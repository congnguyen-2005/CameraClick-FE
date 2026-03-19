const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, expired: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ ...timeLeft, expired: true });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          expired: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) return <span className="text-danger fw-bold">Hết hạn</span>;

  return (
    <div className="d-flex gap-1 align-items-center">
      <div className="time-unit">{timeLeft.days}n</div>
      <div className="time-sep">:</div>
      <div className="time-unit">{timeLeft.hours.toString().padStart(2, '0')}</div>
      <div className="time-sep">:</div>
      <div className="time-unit">{timeLeft.minutes.toString().padStart(2, '0')}</div>
      <div className="time-sep">:</div>
      <div className="time-unit text-warning">{timeLeft.seconds.toString().padStart(2, '0')}</div>
    </div>
  );
};