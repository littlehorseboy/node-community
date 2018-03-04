import config from './config/config';
import app from './config/express';

if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`server started port http://localhost:${config.port} (${config.env})`);
  });
}

export default app;
