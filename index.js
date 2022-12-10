const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const server = express();

server.use(cors());

const configuration = new Configuration({
  apiKey: process.env.SECRETKEY,
});

const openai = new OpenAIApi(configuration);

const available_model = {
  gpt3: {
    "text-davinci-003": {
      desc: "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
      max: "4,000 tokens",
    },
    "text-curie-001": {
      desc: "Very capable, but faster and lower cost than Davinci.",
      max: "2,048 tokens",
    },
    "text-babbage-001": {
      desc: "Capable of straightforward tasks, very fast, and lower cost.",
      max: "2,048 tokens",
    },
    "text-ada-001": {
      desc: "Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost",
      max: "2,048 tokens",
    },
  },

  codex: {
    "code-davinci-002": {
      desc: "Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.",
      max: "8,000 tokens",
    },
    "code-cushman-001": {
      desc: "Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.",
      max: "2,048 tokens",
    },
  },
};

const port = process.env.PORT || 3020;

server.get("/", async (req, res) => {
  const prompt_text = req.query.prompt;
  const model = req.query.model || "text-davinci-003";
  const random = req.query.rand || 0.7;
  const max_result = req.query.max_result || 1650;
  const top_penalty = req.query.top_penalty || 1;
  const frequency_penalty = req.query.frequency_penalty || 0;
  const presence_penalty = req.query.presence_penalty || 0;
  const best_result = req.query.best_result || 1;
  const stop_result = req.query.stop_result;

  if (!prompt_text) {
    res.send({ error: "No Input Given!" });
  } else {

    let openai_cofig;

    if (!stop_result) {
      openai_cofig = {
        model: model,
        prompt: prompt_text,
        temperature: random,
        max_tokens: max_result,
        top_p: top_penalty,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        best_of: best_result,
      };
    } else {
      openai_cofig = {
        model: model,
        prompt: prompt_text,
        temperature: random,
        max_tokens: max_result,
        top_p: top_penalty,
        frequency_penalty: frequency_penalty,
        presence_penalty: presence_penalty,
        best_of: best_result,
        stop: stop_result.split(","),
      };
    }

    const response = await openai.createCompletion(openai_cofig);

    const { choices, usage } = response.data;

    let response_text = [];

    Array.from(choices).forEach((e) => {
      response_text.push(e.text);
    });

    const { prompt_tokens, completion_tokens } = usage;

    const data = {
      prompt: prompt_text,
      model,
      response: response_text,
      prompt_char: prompt_tokens,
      response_char: completion_tokens,
      max_result,
      random,
      top_penalty,
      frequency_penalty,
      presence_penalty,
      best_result,
    };

    res.send({
      data,
    });
  }
});

server.get("/generate_image", async(req,res) => {
  const prompt_text = req.query.prompt
  const number_of_images = req.query.num && req.query.num <= 10 ? req.query.num : 1
  const size = req.query.size ? req.query.size : "256x256"

  const info = {
    number_of_images_limit : "1-10",
    available_size : "256x256, 512x512,1024x1024",
    notice : "An Image URL will be only valid for an hour!"
  }

  if (!prompt_text) {
    res.send({ error: "No Input Given!" });
  } else {

    const img_config = {
      prompt : prompt_text,
      n : number_of_images,
      size : size
    }

  const response = await openai.createImage(img_config);
  image_url = response.data.data[0].url;

    const data  = {
      prompt : prompt_text,
      number_of_images,
      size,
      image_url,
      limitations : info
    }

    res.send({
      data
    })
  
  }

})

server.get("/list_models", async (req, res) => {
  res.send({
    data : available_model
  })
})

server.get("/*", (req, res) => {
  res.send({ error: "Route Does Not Exist!" });
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

module.exports = server
